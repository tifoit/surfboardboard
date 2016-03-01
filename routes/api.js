var Feedback = require('./../models/feedback');
var Track = require('./../models/track');

module.exports = function (app) {
    app.post('/api/feedback', function (request, response, next) {
        console.log('Doing feedback');
        var feedback = Feedback({
            rating: request.body.rating || '',
            comment: request.body.comment || '',
            path: request.body.path || ''
        });

        if (request.isAuthenticated()) {
            console.log('User is logged in for feedback');
            feedback.user = request.user.id
        }

        if (!util.isNullOrUndefined(request.session.track)) {
            console.log('Setting session for feedback');
            feedback.session = request.session.track;
        }

        feedback.save(function (err, feedback) {
            if (err) {
                console.log('Error saving feedback');
                throw err;
            }

            console.log('Returning success for feedback');
            return response.status(200);
        });
    });

    app.post('/api/track/error', function (request, response, next) {
        if (!request.session.track) {
            return response.status(401);
        }

        Track.findOneAndUpdate({
            session: request.session.track
        }, {
            $inc: {
                errorRate: 1
            }
        }, function (err) {
            if (err) {
                throw err;
            }

            return response.status(200);
        });
    });
};