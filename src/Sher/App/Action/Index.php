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
	
	protected $exclude_method_list = array('execute', 'home', 'products', 'smart', 'topic', 'about', 'contact', 'cm', 'lcm', 'xkl', 'dkl', 'water', 'car');
	
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
        return $this->to_html_page('page/topic.html');
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
	
	/**
	 * cm
	 */
	public function cm(){
        return $this->to_html_page('page/cm.html');
	}
	
	/**
	 * lcm
	 */
	public function lcm(){
        return $this->to_html_page('page/lcm.html');
	}
	
	/**
	 * xkl
	 */
	public function xkl(){
        return $this->to_html_page('page/xkl.html');
	}
	
	/**
	 * dkl
	 */
	public function dkl(){
        return $this->to_html_page('page/dkl.html');
	}
	
	/**
	 * water
	 */
	public function water(){
        return $this->to_html_page('page/water.html');
	}
	
	/**
	 * car
	 */
	public function car(){
        return $this->to_html_page('page/car.html');
	}
}
?>
