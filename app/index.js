import router from './router';
import React from 'react/addons';
import {GA_KEY} from './config';

// Enable React dev tools
window.React = React;
window.refugewe = router();

/**
 * Analytics API signature
 * ga('send', 'event', 'category', 'action', 'label');
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', GA_KEY, 'auto');
ga('send', 'pageview');
