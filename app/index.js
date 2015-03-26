'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var exec=require('child_process').exec;

var WebsitetemplateGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay('Welcome to the HTML Website template generator!'));

    var prompts = [{
      name: 'websiteName',
      message: 'What is your websites\'s name?'
    },
    {
      name: 'localAddress',
      message: 'What is your websites\'s local address?'
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Would you initialise a new Git repo?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.websiteName = props.websiteName;
      this.localAddress = props.localAddress;
      this.initGit = props.initGit;

      var newPrompts = [];

      if(this.initGit){
        newPrompts.push({
          name: 'gitRepoURL',
          message: 'What is the URL to repository?',
          default: ''
        });
      }

      this.prompt(newPrompts, function (localProps) {
        if(this.initGit){
          this.gitRepoURL = localProps.gitRepoURL;
        }

        done();
      }.bind(this));

    }.bind(this));
  },

  app: function () {

    // Takes in variable from the setup
    var context = {
      website_name: this.websiteName,
      local_address: this.localAddress
    };

    // Copies HTML files from the template
    this.template("template.html", "template.html", context);
    // this.copy('template.html', 'template.html');
    this.copy('styleguide.html', 'styleguide.html');

    // Duplicates assets folder from the template
    this.directory('assets', 'assets');

    // Project files
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    // this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.template("_Gruntfile.js", "Gruntfile.js", context);
    this.copy('jshintrc', '.jshintrc');

    // Setup Github
    this.directory('git-hooks', 'git-hooks');

    if(this.initGit){
      
      exec('git init', function(){
        //Setup the git-hooks for the new repo
        // this.copy('git-hooks/post-merge', '.git/hooks/post-merge');
        // this.copy('git-hooks/pre-commit', '.git/hooks/pre-commit');

        exec('git add .',function(){
          exec('git commit -m "initial commit"',function(){
            if(this.gitRepoURL !== ''){
              exec('git remote add origin '+this.gitRepoURL, function(){
                exec('git push -u origin master');
              }.bind(this));
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));

    }

  }

});

module.exports = WebsitetemplateGenerator;
