function Controller() {
    const self = this;

    //state
    self.state = {
        survey: { currentStep: 0, answers: {} }
    };

    //methods
    self.index = function() {

    };

    self.reset_survey = function() {
        self.state.survey = { currentStep: 0, answers: {} };
    };

    self.survey_next = function() {

    };
    self.survey_back = function() {

    };
    self.survey_start = function() {

    };
    self.create_question_html = function(question_opts) {
        const question_text = question_opts.question;
        const type = question_opts.type;
        const answers = question_opts.answers;

        var question_html = '<div class="question mt-5">' + question_text + '</div>';
        var answers_html = '<div class="answers">';
        for (var key in answers) {
            const answer_text = answers[key];
            answers_html += '<div id="' + key + '" class="answer">' + answer_text + '</div>';
        }
        answers_html += '</div>';
        return question_html + answers_html;
    };

    self.refresh_ui = function() {

    };

    // initialize
    self.init = function() {
        $('.question-wrapper').html(self.create_question_html(text_resources.questions['1']))
    };
    self.init();
}