<?php
/**
 * 产品相关Action
 * @author purpen
 */
class Sher_App_Action_Product extends Sher_App_Action_Base implements DoggyX_Action_Initialize {
	
	public $stash = array(
		'topic_id'=>'',
		'page'=>1,
	);
	
	protected $page_tab = 'page_sns';
	protected $page_html = 'page/product/index.html';
	protected $exclude_method_list = array('api_view');
	
	public function _init() {
		$this->set_target_css_state('page_sale');
		$this->stash['domain'] = Sher_Core_Util_Constant::TYPE_PRODUCT;
    }
	/**
	 * 入口方法
	 */
	public function execute(){
		
	}
	
	
	
}
?>
