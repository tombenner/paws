// ==UserScript==
// @name         Paws
// @namespace    http://tombenner.co/
// @version      0.0.1
// @description  Keyboard shortcuts for the AWS Console
// @author       Tom Benner
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @require https://code.jquery.com/jquery-1.11.3.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.js
// @require https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js
// ==/UserScript==

$.noConflict();

var Paws = {};

Paws.App = (function() {
  var self = this;

  self.commandsCallbacks = {
    // Services
    'sct': { href: '/cloudtrail/home#/events' },
    'se2': { href: '/ec2/v2/home#Instances:sort=desc:launchTime' },
    'sec': { href: '/elasticache/home#cache-clusters:' },
    'sia': { href: '/iam/home#home' },
    'sr5': { href: '/route53/home#hosted-zones:' },
    'srd': { href: '/rds/home#dbinstances:' },
    'sre': { href: '/redshift/home#cluster-list:' },
    'ss3': { href: '/s3/home' },
    'svp': { href: '/vpc/home' },
    // Pages
    'pam': { href: '/ec2/v2/home#Images:sort=name' },
    'peb': { href: '/ec2/v2/home#Volumes:sort=desc:createTime' },
    'pel': { href: '/ec2/v2/home#LoadBalancers:' },
    'psg': { href: '/ec2/v2/home#SecurityGroups:sort=groupId' },
    // Navbar
    'j': { func: ['navbar', 'next'] },
    'k': { func: ['navbar', 'prev'] },
    'l': { func: ['navbar', 'select'] },
    'return': { func: ['navbar', 'select'] }, // This doesn't work on some services
    // Miscellaneous
    '/': { focus: '.gwt-TextBox:first' },
    '?': { open: 'https://github.com/tombenner/paws#shortcuts' }
  };

  self.init = function() {
    self.navbar = new Paws.Navbar();
    self.initCommands();
    self.log('Initialized');
  }

  self.initCommands = function() {
    _.each(self.commandsCallbacks, function(value, key) {
      var command = key;
      command = command.split('').join(' ');
      var callback;
      if (value['href']) {
        callback = function() {
          self.log('Redirecting to ' + value['href']);
          window.location.href = value['href'];
        };
      } else if (value['open']) {
        callback = function() {
          self.log('Opening ' + value['open']);
          window.open(value['open']);
        };
      } else if (value['focus']) {
        callback = function() {
          self.log('Selecting ' + value['focus']);
          jQuery(value['focus']).focus();
        };
      } else if (value['func']) {
        callback = function() {
          self.log('Calling func');
          var func = value['func'];
          self[func[0]][func[1]]();
        };
      } else {
        self.log('Invalid callback');
      }
      Mousetrap.bind(command, function() {
        callback();
        return false;
      });
    });
  };

  self.log = function(message) {
    console.log('Paws: ' + message);
  };

  self.init();

  return self;
});

Paws.Navbar = (function() {
  var self = this;

  self.select = function() {
    var selectedAnchor = self.getSelectedAnchor();
    if (selectedAnchor.length == 0) {
      return;
    }
    // The [0] is necessary for the click to work on RDS
    selectedAnchor[0].click();
  };

  self.unfocus = function() {
    var selectedAnchor = self.getSelectedAnchor();
    if (selectedAnchor.length == 0) {
      return;
    }
    selectedAnchor.blur();
    selectedAnchor.removeClass('ak-navbar-selected');
    selectedAnchor.css('background-color', '');
  };

  self.next = function() {
    self.anchors = jQuery('.gwt-Anchor');
    var selectedAnchor = self.getSelectedAnchor();
    if (selectedAnchor.length == 0) {
      self.selectAnchor(self.anchors.first());
    } else {
      var index = self.anchors.index(selectedAnchor);
      var anchorToSelect = self.anchors.eq(index + 1);
      self.selectAnchor(anchorToSelect);
    }
  };

  self.prev = function() {
    self.anchors = jQuery('.gwt-Anchor');
    var selectedAnchor = self.getSelectedAnchor();
    if (selectedAnchor.length == 0) {
      self.selectAnchor(self.anchors.last());
    } else {
      var index = self.anchors.index(selectedAnchor);
      var anchorToSelect = self.anchors.eq(index - 1);
      self.selectAnchor(anchorToSelect);
    }
  };

  self.getSelectedAnchor = function() {
    return self.anchors.filter('.ak-navbar-selected:first');
  };

  self.selectAnchor = function(anchor) {
    self.anchors.removeClass('ak-navbar-selected');
    self.anchors.css('background-color', '');
    anchor.css('background-color', 'LightCyan');
    anchor.addClass('ak-navbar-selected');
    anchor.focus();
  };
});

new Paws.App();
