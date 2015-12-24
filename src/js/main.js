require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

var $ = require("jquery");
var ich = require("icanhaz");
var Share = require("share");

var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");
var overviewTemplate = require("./_overviewTriviaTemplate.html");

var score = 0;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);
ich.addTemplate("overviewTemplate", overviewTemplate);

new Share(".share-button", {
  ui: {
    flyout: "top center"
  },
  networks: {
    email: {
      description: [document.querySelector(
          `meta[property="og:description"]`).innerHTML, window.location.href]
        .join("\n")
    }
  }
});

new Share(".share-bottom", {
  ui: {
    flyout: "top left"
  },
  networks: {
    email: {
      description: [document.querySelector(
          `meta[property="og:description"]`).innerHTML, window.location.href]
        .join("\n")
    }
  }
});

//create new question from template
var showQuestion = function(questionId) {
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

// show submit button when answer is selected
var watchInput = function() {
  $(".quiz-box").on("click", "input", (function() {
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  }));
};

$(".quiz-container").on("click", ".submit", function() {
  // score answer
  var answerData = {};
  answerData.question = quizData[id].question;
  var correct = $("input:checked").val();
  if (correct) {
    score += 1;
    answerData.hooray = true;
  }

  // keep track of selected answer
  quizData[id].answers.forEach(function(a) {
    if (a.correct) {
      answerData.correct = a.answer;
      answerData.image = quizData[id].image;
      answerData.description = quizData[id].desc;
    }
  });

  $(".question-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  // Change button text on last question
  if (id == Object.keys(quizData).length) {
    $(".next").html("Finish");
  }
  watchNext();
});


var watchNext = function() {
  $(".next").click(function() {
    if (id < Object.keys(quizData).length) {
      // move on to next question
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    } else {
      calculateResult();
    }
  });
};

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    if (score >= result.min && score <= result.max) {
      // display result
      result.score = score;
      if (result.score > 5) {
        result.color = "#589040";
      } else if (result.score > 2) {
        result.color = "#F5AE3F";
      } else {
        result.color = "#e12329";
      }
      result.total = Object.keys(quizData).length;

      $(".question-box").html(ich.overviewTemplate(result));

      new Share(".share-results", {
        description: "I scored " + result.score + "/" + result.total +
          "! " + document.querySelector(`meta[property="og:description"]`)
          .innerHTML,
        ui: {
          flyout: "bottom right",
          button_text: "Share results"
        },
        networks: {
          email: {
            description: "I scored " + result.score + "/" + result.total +
              "! " + [document.querySelector(
                  `meta[property="og:description"]`).innerHTML, window.location
                .href
              ].join("\n")
          }
        }
      });
    }
  }
};

elsewhereData.forEach(function(story) {
  $(".dont-miss").append(
    `
      <div class="story">
        <div class="padded">
        <a href=${story.link}>
          <img src="./assets/elsewhere/${story.image}"></img>
        </a>
          <div class="small">${story.category}</div>
        <a href=${story.link}>
          <div>${story.title}</div>
        </a>
        </div>
      </div>
    `
  );
});

showQuestion(id);
watchInput();
