<?php
/**
 * 评测试用管理
 * @author purpen
 */
class Sher_Admin_Action_Topic extends Sher_Admin_Action_Base implements DoggyX_Action_Initialize {
	
	public $stash = array(
		'page' => 1,
		'size' => 20,
	);
	
	public function _init() {
		$this->set_target_css_state('page_topic');
    }
	
	/**
	 * 入口
	 */
	public function execute() {
		return $this->get_list();
	}
	
	/**
	 * 列表
	 */
	public function get_list() {		
		$pager_url = Doggy_Config::$vars['app.url.admin'].'/topic?page=#p#';
		
		$this->stash['pager_url'] = $pager_url;
		
		return $this->to_html_page('admin/topic/list.html');
	}
	
	/**
	 * 编辑器参数
	 */
	protected function editor_params() {
		$callback_url = Doggy_Config::$vars['app.url.qiniu.onelink'];
		$this->stash['editor_token'] = Sher_Core_Util_Image::qiniu_token($callback_url);
		$this->stash['editor_pid'] = new MongoId();

		$this->stash['editor_domain'] = Sher_Core_Util_Constant::STROAGE_ASSET;
		$this->stash['editor_asset_type'] = Sher_Core_Model_Asset::TYPE_ASSET;
	}
	
	/**
	 * 新增评测
	 */
	public function edit() {
		$this->stash['mode'] = 'create';
		
		$data = array();
		if (!empty($this->stash['id'])){
			$model = new Sher_Core_Model_Topic();
			$data = $model->extend_load((int)$this->stash['id']);
			
			$this->stash['mode'] = 'edit';
		}
		$this->stash['topic'] = $data;
		
		$this->stash['token'] = Sher_Core_Util_Image::qiniu_token();
		$this->stash['pid'] = new MongoId();
		
		$this->stash['domain'] = Sher_Core_Util_Constant::STROAGE_TRY;
		$this->stash['asset_type'] = Sher_Core_Model_Asset::TYPE_TRY;
		
		$this->editor_params();
		
		return $this->to_html_page('admin/topic/edit.html');
	}
	
	/**
	 * 保存
	 */
	public function save() {
		// 验证数据
		if(empty($this->stash['title']) || empty($this->stash['description'])){
			return $this->ajax_json('获取数据错误,请重新提交', true);
		}
		
		$model = new Sher_Core_Model_Topic();
		if(empty($this->stash['_id'])){
			// 发起人
			$this->stash['user_id'] = (int)$this->visitor->id;
			
			$ok = $model->apply_and_save($this->stash);
			
			$data = $model->get_data();
			$id   = $data['_id'];
		}else{
			$ok = $model->apply_and_update($this->stash);
			
			$id = $this->stash['_id'];
		}
		
		if(!$ok){
			return $this->ajax_note('数据保存失败,请重新提交', true);
		}
		
		// 上传成功后，更新所属的附件
		if(isset($this->stash['asset']) && !empty($this->stash['asset'])){
			$model->update_batch_assets($this->stash['asset'], (int)$id);
		}
		
		$next_url = Doggy_Config::$vars['app.url.admin_base'].'/topic';
		
		return $this->ajax_json('观点保存成功！', false, $next_url);
	}
	
	/**
	 * 删除
	 */
	public function delete() {
		if(!empty($this->stash['id'])){
			$model = new Sher_Core_Model_Topic();
			$model->remove((int)$this->stash['id']);
		}
		
		return $this->to_taconite_page('admin/del_ok.html');
	}
	
	/**
	 * 删除附件
	 */
	public function delete_asset(){
		$id = $this->stash['id'];
		$asset_id = $this->stash['asset_id'];
		if (empty($id) || empty($asset_id)){
			return $this->ajax_note('附件不存在！', true);
		}
		$model = new Sher_Core_Model_Topic();
		$model->delete_asset($id, $asset_id);
		
		return $this->to_taconite_page('ajax/delete_asset.html');
	}
	
	/**
	 * 确认发布
	 */
	public function publish() {
		return $this->update_state(Sher_Core_Model_Topic::STATE_PUBLISH);
	}
	
	/**
	 * 确认撤销发布
	 */
	public function unpublish() {
		return $this->update_state(Sher_Core_Model_Topic::STATE_DRAFT);
	}
	
	/**
	 * 确认发布评测
	 */
	protected function update_state($state) {
		if(empty($this->stash['id'])){
			return $this->ajax_notification('缺少请求参数！', true);
		}
		
		try{
			$model = new Sher_Core_Model_Topic();
			$model->mark_as_publish((int)$this->stash['id'], (int)$state);
		}catch(Sher_Core_Model_Exception $e){
			return $this->ajax_notification('请求操作失败，请检查后重试！', true);
		}
		
		$this->stash['state'] = $state;
		
		return $this->to_taconite_page('admin/publish_ok.html');
	}
	
	
}
?>