module.exports = {
    getLoginPage: (req, res) => {
        res.render('login.ejs', {
            title: 'Login',
            loginMSG: '',
            regMSG: ''
        })
    },

    getAuthCheck: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            db.query('SELECT Uid , URole  FROM user_credencials WHERE Uusername = ? AND Upassword = ?', [username, password], function(error, results, fields, rows) {
                if (results != undefined) {
                    if (results.length > 0) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.userid = results[0].Uid
                        req.session.userrole = results[0].URole

                        CheckID = results[0].URole
                        if (CheckID === 2) {
                            db.query('SELECT *  FROM employee', [username, password], function(error, results, fields, rows) {
                                req.session.participants = results.length
                                res.redirect('/adminevents');
                            });
                        } else if (CheckID === 1) {
                            db.query('SELECT *  FROM employee', [username, password], function(error, results, fields, rows) {
                                req.session.participants = results.length
                                res.redirect('/events');
                            });
                        } else res.send('<h1>SERVER DOWN <small> Please try again<small><h1>')
                    } else {
                        req.session.loggedin = false;
                        res.redirect('/loginFail');
                    }
                } else {
                    req.session.loggedin = false;
                    res.redirect('/loginFail');
                }
            });
        } else {
            res.redirect('/login');
        }
    },

    getRegAuthCheck: (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var dept = req.body.dept;
        if (username && password) {
            db.query('SELECT * FROM user_credencials WHERE Uusername = ? AND Upassword = ?', [username, password], function(error, results, fields, rows) {
                if (results.length === 0) {
                    db.query('INSERT INTO user_credencials (Uusername,Upassword,Urole) VALUES (?,?,?)', [username, password, 1], function(error, results, fields, rows) {
                        db.query('SELECT Uid AS ID FROM user_credencials WHERE Uusername = ?', [username], function(error, results, fields, rows) {
                            db.query('INSERT INTO student (SUid,Sname,Sdept) VALUES (?,?,?)', [results[0].ID, name, dept], function(error, results, fields, rows) {
                                res.render('login.ejs', {
                                    title: 'Login',
                                    loginMSG: `${username} is Registered Succesfully`,
                                    regMSG: ''
                                });
                            });
                        });
                    });
                } else {
                    console.log('Here2')
                    req.session.loggedin = false;
                    res.redirect('/regFail');
                }
            });
        } else {
            console.log('Here1')
            req.session.loggedin = false;
            res.redirect('/regFail');
        }
    },

    getFailLogin: (req, res) => {
        res.render('login.ejs', {
            title: 'Login',
            loginMSG: 'Incorrect Username or Password!',
            regMSG: ''
        });
    },

    getFailReg: (req, res) => {
        res.render('login.ejs', {
            title: 'Login',
            loginMSG: '',
            regMSG: 'Username Exist !!'
        });
    },

    getLogoutCheck: (req, res) => {
        req.session.loggedin = false;
        res.redirect('/login');
    }
}