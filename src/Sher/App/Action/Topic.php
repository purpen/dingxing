<?php
/**
 * 观点王
 * @author purpen
 */
class Sher_App_Action_Topic extends Sher_App_Action_Base {
	public $stash = array(
		'cid' => 0,
	);
	
	protected $exclude_method_list = '*';
	
	/**
	 * 默认入口
	 */
	public function execute(){
		return $this->getlist();
	}
	
	/**
	 * 文章列表
	 */
	public function getlist(){
		
		return $this->to_html_page('page/articles.html');
	}
	
	/**
	 * 文章详情
	 */
	public function view(){
		$id = (int)$this->stash['id'];
		
		$redirect_url = Doggy_Config::$vars['app.url.topic'];
		if(empty($id)){
			return $this->show_message_page('访问的主题不存在！', $redirect_url);
		}
		// 是否允许编辑
		$editable = false;
		
		if(isset($this->stash['referer'])){
			$this->stash['referer'] = Sher_Core_Helper_Util::RemoveXSS($this->stash['referer']);
		}
		
		$model = new Sher_Core_Model_Topic();
		$topic = $model->load($id);
		
		if(empty($topic) || $topic['deleted']){
			return $this->show_message_page('访问的主题不存在或已被删除！', $redirect_url);
		}
        if (!empty($topic)) {
            $topic = $model->extended_model_row($topic);
        }
		
		// 增加pv++
		$inc_ran = rand(1,6);
		$model->increase_counter('view_count', $inc_ran, $id);
		
		// 当前用户是否有管理权限
		if ($this->visitor->id){
			if ($this->visitor->id == $topic['user_id'] || $this->visitor->can_admin){
				$editable = true;
			}
		}
		
		// 是否出现后一页按钮
	    if(isset($this->stash['referer'])){
            $this->stash['HTTP_REFERER'] = $this->current_page_ref();
	    }
		
		// 获取父级分类
		$category = new Sher_Core_Model_Category();
		$parent_category = $category->extend_load((int)$topic['fid']);
		
		$this->stash['topic'] = &$topic;
		$this->stash['parent_category'] = $parent_category;
		$this->stash['editable'] = $editable;
		// 评论的链接URL
		$this->stash['pager_url'] = Sher_Core_Helper_Url::topic_view_url($id, '#p#');
		
		return $this->to_html_page('page/show.html');
	}
	
}
?>