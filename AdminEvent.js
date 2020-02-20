module.exports = {

    getAdminEventPage: (req, res) => {
        if (req.session.loggedin === true) {
            var userID = req.session.userid
            db.query('SELECT E.Ename AS Ename,E.Edept AS Edept, EO.EOname AS EOname FROM employee E , events_organizer EO WHERE E.EUid = ? AND E.Eid = EO.EOid', [userID], function(error, results, fields, rows) {
                req.session.Ename = results[0].Ename
                req.session.EOname = results[0].EOname
                    //db.query('SELECT * FROM employee EE ,events E , events_organizer EO WHERE EE.EUid = ? AND EE.Eid = EO.EOeid AND E.EVorgid = EO.EOid', [userID], function(error, results, fields, rows) {
                db.query('SELECT * FROM events', [userID], function(error, results, fields, rows) {
                    length = results.length
                    res.render('Aevents.ejs', {
                        title: 'AdminEvents',
                        totalParticipants: req.session.participants,
                        userName: req.session.Ename,
                        userOrganizer: req.session.EOname,
                        results,
                        length
                    })
                });
            });
        } else {
            res.redirect('/login');
        }
    },

    getLogoutCheck: (req, res) => {
        req.session.loggedin = false;
        res.redirect('/login');
    }
}