function Controller() {
    const self = this;

    //state
    self.state = {
         currentQid: null, userAnswers: {}
    };

    //methods
    self.index = function() {
        $('.sub-header').css('display', 'none').html(self.intro_html()).fadeIn('slow');
        $('body').addClass('intro');
        $('.progress-control-wrapper').css('display', 'none');
        self.switch_image(text_resources.intro_image);
    };

    self.questions_ids_array = function() {
        var arr = [];
        for (var key in text_resources.questions) { arr.push(key); }
        return arr;
    };

    self.reset_survey = function() {
        self.state = { currentQid: null, userAnswers: {} };
    };

    self.survey_next = function() {
        $('body').removeClass('intro').addClass('survey');

        var qnum = self.questions_ids_array().length;
        if (!self.state.currentQid) self.state.currentQid = 1;
        else if (self.state.currentQid == qnum) {
            self.state.userAnswers[self.state.currentQid] = $('.answer.checked').attr('answer-id');
            self.survey_submit();
            self.refresh_ui();
            return;
        }
        else {
            // save user answer
            self.state.userAnswers[self.state.currentQid] = $('.answer.checked').attr('answer-id');
            self.state.currentQid = Math.min(qnum, self.state.currentQid + 1);
        }
        self.switch_image(text_resources.questions[self.state.currentQid].background);
        self.refresh_ui();
        console.log(self.state);
    };
    self.survey_back = function() {
        if (!self.state.currentQid) self.state.currentQid = 1;
        else self.state.currentQid = Math.max(1, self.state.currentQid - 1);
        self.refresh_ui();
    };
    self.survey_start = function() {
        self.state.currentQid = 1;
        $('body').removeClass('intro').addClass('survey');
        $('.content').html('<div class="question-wrapper"></div>');;
        $('.progress-control-wrapper').css('display', 'block');
        self.switch_image(text_resources.questions[1].background);
    };
    self.survey_submit = function() {
        // send results to server
        // display congratulations
        $('body').removeClass('survey').addClass('last');
        $('.content').css('display', 'none').html(self.congratulations_html()).fadeIn('fast');
        $('.progress-control-wrapper').css('display', 'none');
        self.switch_image(text_resources.cong_image);
    };
    self.open_question = function(question_id) {
        $('.question-wrapper').css('display', 'none').html(self.create_question_html(text_resources.questions[question_id])).fadeIn('fast');
        self.set_progress(question_id);
        $('.answer').click(function () {
            self.choose_answer($(this).attr('answer-id'));
            self.survey_next();
        });
    };
    self.set_progress = function(qid) {
        $('.progressbar > div').each(function () {
            if (parseInt($(this).attr('question-id')) <= qid) $(this).addClass('active');
            else $(this).removeClass('active');
        });
        //$('.progressbar > div[question-id=' + qid + 1 + ']::after').css('background-color', 'var(--lb-progressbar-inactive)');
    };
    self.switch_image = function (url) {
        $('.header-img').css('background-image', 'url('+url+')');
    };
    self.choose_answer = function (aid) {
        $('.answer').removeClass('checked');
        $('.answer[answer-id='+aid+']').addClass('checked');
    };
    self.create_question_html = function(question_opts) {
        const question_text = question_opts.question;
        const type = question_opts.type;
        const answers = question_opts.answers;

        const animdir = [ 'Right', 'Left' ];

        var question_html = '<div class="question animated bounceIn' + animdir[Math.floor(Math.random()*animdir.length)]
            + ' mt-5">' + question_text + '</div>';
        var answers_html = '<div class="answers">';
        for (var key in answers) {
            const answer_text = answers[key];
            answers_html += '<div answer-id="' + key + '" class="answer animated bounceIn' +
                animdir[Math.floor(Math.random()*animdir.length)] + '">' + answer_text + '</div>';
        }
        answers_html += '</div>';
        return question_html + answers_html;
    };
    self.generate_progressbar_html = function() {
        var bar_html = '<div class="progressbar">';
        var num_questions = 0;
        for (var key in text_resources.questions) {
            bar_html += '<div question-id="' + key + '"></div>';
            num_questions++;
        }
        bar_html += '</div>';
        $('.progress-control-wrapper').html(bar_html);
        $('.progressbar div').css('width', (100.0 / num_questions) + "%");
        return bar_html;
    };

    self.refresh_ui = function() {
        const qnum = self.questions_ids_array().length;
        if (self.state.currentQid) {
            $('.sub-header').empty();
            self.open_question(self.state.currentQid);
        }
    };

    self.congratulations_html = function() {
        return '<div class="congratulations animated fadeInUp">' +
            '<h2 class="text-left uppercase">'+text_resources.cong_title+ '</h2> '+
            '<p class="text-left">'+text_resources.congratulations+'</p>' +
            '</div>';
    };
    self.intro_html = function() {
        return '<div class="intro row mt-5">' +
            '<div class="col-md-8">' +
                '<h1 class="text-left animated bounceInDown uppercase">'+text_resources.intro1+ '</h1>' +
                '</br>'+
                '<h4 class="text-left animated bounceInRight">'+text_resources.intro2+'</h4>' +
            '</div>' +
            '<div class="col-md-4 text-left">' +
                '<button class="btn btn-success start-btn animated bounceIn">'+text_resources.start_btn+
                '<span><img src="images/icons/006-right-chevron-w.png"></span>' +
                '</button>' +
            '</br>' +
            '<h5 class="text-left animated bounceInLeft">'+text_resources.intro3+'</h5>' +
            '</div>' +
            '</div>';
    };

    // initialize
    self.init = function() {
        self.generate_progressbar_html();
        self.state.currentQid = null;
        self.index();

        // bind callbacks
        $('.intro .start-btn').click(function () {
            self.survey_start();
            self.refresh_ui();
        });
        self.refresh_ui();

    };
    self.init();
    /*self.survey_start();
    self.refresh_ui();
    self.survey_submit();*/
}