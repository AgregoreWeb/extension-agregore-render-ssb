note: security warning when installing ssb-markdown

https://github.com/advisories/GHSA-7wwv-vh3v-89cq

https://github.com/highlightjs/highlight.js/issues/2877

... but it appears we are using the latest highlight.js actually. only versions prior to version 10 were affected. presumably the vulnerability doesn't apply anyway, since the user would need to attack themselves? (because ssb server is on the local machine - a remote ssb server over ws would SHS to connect so also not a problem; not that ws are integrated yet though..) todo: ask @RangerMauve

> The Regular expression Denial of Service (ReDoS) is a Denial of Service attack, that exploits the fact that most Regular Expression implementations may reach extreme situations that cause them to work very slowly (exponentially related to input size). An attacker can then cause a program using a Regular Expression to enter these extreme situations and then hang for a very long time.

```
npm ll

ssb-markdown@6.0.7
│ /home/av8ta/agregore/ssb-markdown
│ patchwork's markdown parser
├── emoji-regex@8.0.0
│
├── hashtag-regex@2.1.0
│
├── highlight.js@11.4.0
│
├── markdown-it-emoji@1.4.0
│
├── markdown-it-hashtag@0.4.0
│
├── markdown-it@10.0.0
│
├── node-emoji@1.10.0
│
├── ssb-msgs@5.2.0
│
├── ssb-ref@2.13.9
│
├── standard@14.3.3
│
└── tape@4.13.2
```


the main question, though, is since agregore provides highlight.js on the window global we should probably use that instead of bundling highlight again. todo: investigate that
