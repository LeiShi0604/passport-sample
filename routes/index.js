var express = require('express');
var router = express.Router();


var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {

	//ログイン時のエラーメッセージ表示
	var errorMsg = '';
	var error = req.flash().error;
	if(error){
		var errorMsg = error[0];
	}
	//ログインページ
	res.render('index', { title: 'Express', msg: errorMsg });
});


//ログイン処理
//入力値が空かどうかはpassport側でチェックしてくれているのでそれ用のバリデーションは不要。
router.post(
	'/testlogin',
	passport.authenticate('local'),
	function(req, res, next) {	
		//認証成功した場合の処理（認証失敗は自動で401でレスポンスされる）	
		res.sendStatus(200);
	}
);
//mypageに遷移する場合
router.get('/testmypage', function(req, res, next){
	//認証チェック
	if(req.user){
		//認証済
		res.json({'msg':'mypage of '})
		//res.sendStatus(200);
	}else{
		res.json({'msg':'not logged in'})
		//res.sendStatus(401);
	}
});
//ログアウト
router.get('/testlogout', function(req, res, next){
	if(req.user){
		//ログアウト（sessionの破棄）
		req.logout();
		res.json({'msg':'logged out'});
		//res.sendStatus(200);
	}
})


router.post(
	'/login', 
	passport.authenticate( 'local', { successRedirect: '/mypage', failureRedirect: '/', failureFlash: true, badRequestMessage: '入力値が空です' }), 
	function(req, res, next) {
		//認証成功した場合のコールバック
		//成功時のリダイレクトは successRedirect で指定しているので、ここですることは特にないかもしれない。
	}
);


//マイページ（ログイン後のページで認証済みじゃないと見れない）
router.get('/mypage', function(req, res, next) {

	//log
	
	console.log(req.user);

	if(req.user){
		//userが存在する場合は認証済み
		res.render('mypage', { title: 'Mypage' });
	}else{
		res.redirect('/');
	}
});


//設定画面（認証済みじゃないと見れない）
router.get('/setting', function(req, res, next) {

	//log
	console.log('mypage');
	console.log(req.user);

	if(req.user){
		//userが存在する場合は認証済み
		res.render('setting', { title: 'Setting' });
	}else{
		res.redirect('/');
	}
});


//ログアウト
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
