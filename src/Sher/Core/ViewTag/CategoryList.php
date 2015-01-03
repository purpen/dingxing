<?php
/**
 * 分类列表标签
 * @author purpen
 */
class Sher_Core_ViewTag_CategoryList extends Doggy_Dt_Tag {
    protected $argstring;
	
    public function __construct($argstring, $parser, $pos = 0) {
        $this->argstring = $argstring;
    }

    /**
     * 列表的条件保持与索引顺序一致(non-PHPdoc)
     * @see Doggy/Dt/Doggy_Dt_Node#render()
     */
    public function render($context, $stream) {
        $page = 1;
        $size = 100;
		
        $pid = 0;
		$only_open = 0;
		$domain = 0;
		$stage = 9;
		
		$show_all = 0;
		$current = 0;
		
        $var = 'list';
        $include_pager = 0;
        $pager_var = 'pager';
		$sort_field = 'orby';

        extract($this->resolve_args($context,$this->argstring,EXTR_IF_EXISTS));

        $page = (int) $page;
        $page || $page = 1;
        $size = (int)$size;
		
        $query = array();
		
		if ($domain) {
			$query['domain'] = (int)$domain;
		}
		// 默认为0，顶级分类
		$query['pid'] = (int)$pid;
		
		if ($only_open == Sher_Core_Model_Category::IS_OPENED) {
			$query['is_open'] = Sher_Core_Model_Category::IS_OPENED;
		}elseif ($only_open == Sher_Core_Model_Category::IS_HIDED) {
			$query['is_open'] = Sher_Core_Model_Category::IS_HIDED;
		}
		
		
        $service = Sher_Core_Service_Category::instance();
        $options['page'] = $page;
        $options['size'] = $size;
		$options['sort_field'] = $sort_field;
		
        $result = $service->get_category_list($query,$options);
		
		if (!empty($result['rows'])){
			$categories = $result['rows'];
			
	        if ($show_all) {
		        $all_category['_id']    = 0;
		        $all_category['title']  = '全部';
		        $all_category['name']   = 'all';
				$all_category['domain'] = $domain;
				
				if (!$current){
					$all_category['active'] = 'active';
				}
				
		        array_unshift($categories, $all_category);
		    }
			
	        for ($i=0; $i<count($categories); $i++) {	
	        	if(empty($current)){
	        		continue;
	        	}
	            if (!is_array($current)){
	            	if($current == $categories[$i]['_id']){
	            		$categories[$i]['active'] = 'active';
	            	}
	            }else{
	                if(in_array($categories[$i]['_id'], $current)){
	                    $categories[$i]['active'] = 'active';
	                }
	            }
	        }
			
			// 重写rows
			$result['rows'] = $categories;
		}
        
        $context->set($var, $result);
        if ($include_pager) {
            $context->set($pager_var,$result['pager']);
        }
        
    }
}
?>