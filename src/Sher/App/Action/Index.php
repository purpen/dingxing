<?php
/**
 * 首页,列表页面
 */
class Sher_App_Action_Index extends Sher_App_Action_Base {
	public $stash = array(
		'page'=>1,
		'sort'=>'latest',
		'rank'=>'day',
		'q'=>'',
		'ref'=>'',
		// 邀请码
		'l'=>'',
	);
	
	// 一个月时间
	protected $month =  2592000;
	
	protected $page_tab = 'page_index';
	protected $page_html = 'page/index.html';
	
	protected $exclude_method_list = array('execute', 'home', 'products', 'topic', 'smart', 'about', 'contact');
	
	protected $admin_method_list = array();
	
	/**
	 * 网站入口
	 */
	public function execute(){
		return $this->home();
	}
	
    /**
     * 首页
     * @return string
     */
    public function home(){
		$this->set_target_css_state('page_home');
        return $this->to_html_page('page/index.html');
    }
	
	/**
	 * 产品汇
	 */
	public function products(){
		$this->set_target_css_state('page_products');
        return $this->to_html_page('page/products.html');
	}
	
	/**
	 * 智能馆
	 */
	public function smart(){
		$this->set_target_css_state('page_smart');
        return $this->to_html_page('page/smart.html');
	}
	
	/**
	 * 观点王
	 */
	public function topic(){
		$this->set_target_css_state('page_smart');
        return $this->to_html_page('page/try.html');
	}
	
	/**
	 * 关于鼎兴
	 */
	public function about(){
		$this->set_target_css_state('page_about');
        return $this->to_html_page('page/about.html');
	}
	
	/**
	 * 联系我们
	 */
	public function contact(){
		$this->set_target_css_state('page_contact');
        return $this->to_html_page('page/contact.html');
	}
	
}
?>
