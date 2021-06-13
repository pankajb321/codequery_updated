var express = require('express');
var router = express.Router();
var functionHelper = require('../functionHelper')

var verifyLogin = (req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/')
  }
}



/* GET home page. */
router.get('/',(req,res)=>{
  // console.log(req.session)
  if(req.session.userLoggedIn){
    res.redirect('/home')
  }else{
    res.render('index',{loginErr:req.session.loginErr})
    req.session.loginErr = false;
  }
});
router.get('/home',verifyLogin,(req,res)=>{
  res.render('home',{user:req.session.user})
});

router.get('/register',(req,res)=>{
  if(req.session.userLoggedIn){
    res.redirect('/home');
  }else{
    res.render('register',{err_msg:req.session.signupError})
    req.session.signupError = false;
  }
});

router.get('/test',(req,res)=>{
  console.log(req.session);
  
});

router.get('/qa',verifyLogin,(req,res)=>{
  res.render('Q&A',{user:req.session.user})
});

router.get('/about',verifyLogin,(req,res)=>{
  res.render('about',{user:req.session.user})
});

router.get('/logout',(req,res)=>{
  req.session.user = null;
  req.session.userLoggedIn = false;
  res.redirect('/')
});



router.post('/register',(req,res)=>{

  functionHelper.doSignup(req.body).then((user)=>{
    req.session.user = user;
    req.session.userLoggedIn = true;
    res.redirect('/home')
  }).catch((err_msg)=>{
    req.session.signupError = err_msg;
    res.redirect('/register')
  })
})
// router.get('/testt',(req,res)=>{
//   res.render('test')
// })


router.post('/home',(req,res)=>{
  functionHelper.doLogin(req.body).then((user)=>{
    req.session.user = user;
    req.session.userLoggedIn = true;
    // console.log(req.session);
    res.redirect('/home')
  }).catch((loginErr_msg)=>{
    req.session.loginErr=loginErr_msg;
    console.log(loginErr_msg);
    res.redirect('/')
  })
});


// dummy
router.post('/ask-qn',(req,res)=>{
  // console.log(req.body);
  functionHelper.addQuestion(req.body).then((response)=>{
    console.log(response);
    res.redirect('/home/dummy')
 })
});



router.get('/home/dummy',verifyLogin,(req,res)=>{
  res.render('dummy/dummy-qn-ans',{user:req.session.user})
});

router.get('/home/dummy-qn',verifyLogin,(req,res)=>{
  res.render('dummy/questions-display')
});


router.get('/home/dummy/categories/webdev',(req,res)=>{
  
  const category = 'web_dev'
  functionHelper.getAllQuestions(category).then((questions)=>{
    res.render('dummy/webdev',{questions,user:req.session.user})
  }).catch((empty_msg)=>{
    res.render('dummy/webdev',{empty_msg})
  })
});

router.get('/home/dummy/categories/artificialintelligence',(req,res)=>{
  const category = 'ai'
  functionHelper.getAllQuestions(category).then((questions)=>{
    // console.log(questions);
    res.render('dummy/ai',{questions,user:req.session.user})
  }).catch((empty_msg)=>{
    res.render('dummy/ai',{empty_msg})
  })
});

router.get('/home/dummy/categories/cybersecurity',(req,res)=>{
  const category = 'cyber_sec'
  functionHelper.getAllQuestions(category).then((questions)=>{
    res.render('dummy/cyber',{questions,user:req.session.user})
  }).catch((empty_msg)=>{
    res.render('dummy/cyber',{empty_msg})
  })
});

router.get('/home/dummy/categories/softwaretesting',(req,res)=>{
  const category = 'testing'
  functionHelper.getAllQuestions(category).then((questions)=>{
    res.render('dummy/testing',{questions,user:req.session.user})
  }).catch((empty_msg)=>{
    res.render('dummy/testing',{empty_msg})
  })
});

router.get('/dummy/myquestions',(req,res)=>{
  functionHelper.getMyQuestions(req.session.user.user_id).then((questions)=>{
    res.render('dummy/myqns',{questions})
  }).catch((empty_msg)=>{
    res.render('dummy/myqns',{empty_msg})

  })
});

router.post('/post-ans',(req,res)=>{
  let qnId = req.body.qn_id;
  functionHelper.addAnswer(req.body).then((response)=>{
      // console.log(req.body);
      res.redirect('back')
  }).catch((err)=>{
    console.log('Error'+err);
  })
});

router.get('/dummy/answers/:qnId',(req,res)=>{
  let qnId = req.params.qnId;
  functionHelper.getQuestion(qnId).then((question)=>{
    console.log(question);
    functionHelper.getAnswers(qnId).then((answers)=>{
      answers=answers.reverse();
      // console.log(answers);
      if(answers.length === 0){
        res.render('dummy/answers',{question,empty_msg:'No answers yet for this question'})

      }else{
        res.render('dummy/answers',{question,answers})
      }

    })
  })
  
  
})



// dummy




























module.exports = router;
