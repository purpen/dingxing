#!/usr/bin/env php
<?php
/**
 * fix user name => nickname
 */
$config_file =  dirname(__FILE__).'/../deploy/app_config.php';
if (!file_exists($config_file)) {
    die("Can't find config_file: $config_file\n");
}

include $config_file;

define('DOGGY_VERSION', $cfg_doggy_version);
define('DOGGY_APP_ROOT', $cfg_app_deploy_root);
define('DOGGY_APP_CLASS_PATH', $cfg_app_class_path);

require $cfg_doggy_bootstrap;
@require 'autoload.php';
@require $cfg_app_rc;

set_time_limit(0);

// 创建系统账户
function create_system_user(){
	echo "Create system user ...\n";
	try{
		$user = new Sher_Core_Model_User();
		$data = array(
			'account'  => 'admin@topct.cn',
			'password' => sha1('thn2014'),
			'nickname' => '鼎兴商贸',
		
			'state' => Sher_Core_Model_User::STATE_OK,
			'role_id'  => Sher_Core_Model_User::ROLE_ADMIN,
		);
		
		$ok = $user->create($data);
		
		if ($ok){
			echo "Create system user is ok!\n";
		}
		
	}catch(Sher_Core_Model_Exception $e){
		echo "Create system user failed: ".$e->getMessage();
	}
}

// 创建分类
function create_category(){
	$categories = array(
		array('title'=>'评测','name'=>'try','domain'=>1),
		array('title'=>'试用体验','name'=>'taste','domain'=>1),
		array('title'=>'产品动态','name'=>'newest','domain'=>1),
		array('title'=>'线下活动','name'=>'event','domain'=>1),
	);
	
	try{
		$model = new Sher_Core_Model_Category();
		foreach ($categories as $cate){
			$model->create($cate);
		}
	}catch(Sher_Core_Model_Exception $e){
		echo "Create the category failed: ".$e->getMessage();
	}
	
	echo "Create the category is ok! \n";
}

echo "Install ... \n";

create_system_user();

create_category();

echo "Install is OK! \n";
?>