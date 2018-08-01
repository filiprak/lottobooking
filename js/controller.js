function Controller() {
    const self = this;

    //state
    self.state = {
         currentQid: null, userAnswers: {}
    };

    //methods
    self.index = function() {
        $('.content').css('display', 'none').html(self.intro_html()).fadeIn('slow');
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
        $('.content').html('<div class="question-wrapper"></div>');;
        $('.progress-control-wrapper').css('display', 'block');
        self.switch_image(text_resources.questions[1].background);
    };
    self.survey_submit = function() {
        // send results to server
        // display congratulations
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
        $('.header').css('background', 'url('+url+') center no-repeat');
    };
    self.choose_answer = function (aid) {
        $('.answer').removeClass('checked');
        $('.answer[answer-id='+aid+']').addClass('checked');
    };
    self.create_question_html = function(question_opts) {
        const question_text = question_opts.question;
        const type = question_opts.type;
        const answers = question_opts.answers;

        var question_html = '<div class="question mt-5">' + question_text + '</div>';
        var answers_html = '<div class="answers">';
        for (var key in answers) {
            const answer_text = answers[key];
            answers_html += '<div answer-id="' + key + '" class="answer">' + answer_text + '</div>';
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
            self.open_question(self.state.currentQid);
        }
    };

    self.congratulations_html = function() {
        return '<div class="congratulations">' +
            '<h2 class="text-center">'+text_resources.cong_title+ '</h2> '+
            '<p>'+text_resources.congratulations+'</p>' +
            '</div>';
    };
    self.intro_html = function() {
        return '<div class="intro mt-5">' +
            '<h1 class="text-center">'+text_resources.intro1+ '</h1> '+
            '<h3>'+text_resources.intro2+'</h3>' +
            '<h5>'+text_resources.intro3+'</h5>' +
            '<button class="btn btn-success start-btn">'+text_resources.start_btn+'</button>' +
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
}