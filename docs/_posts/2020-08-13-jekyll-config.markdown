---
layout: post
title:  "Jekyll Config"
date:   2020-08-13 12:55:36 +0100
categories: jekyll
---

The main purpose of this project log is to record the smaller details around the project work like the set up process or just how I've gone about getting things working. In the interest of sticking to that I thought I'd write down the commands I needed just to get this [Jekyll][jekyll-docs] site up and running as I wasn't quite what the docs said (it's worth noting I'm on MacOS Catalina 10.15.4).

Initial file structure with the root as the Github repository:

```
.
├── README.md
└── docs
    └── <Github Pages>
```

Inside `/docs`:

```bash
$ bundle init
$ bundle add jekyll
```

Inside `Gemfile` change the Jekyll version to 3.9.0 as per the Github pages docs.

```bash
$ bundle update
$ bundle exec jekyll new . --force
$ bundle install
```

Inside `Gemfile` uncomment the line with the Github pages gem and add the relevant version number:

```YAML
gem "github-pages", "~> 207", group: :jekyll_plugins
```

That should now be good to go. To view your Jekyll site locally run:

```
$ bundle exec jekyll serve
```

[jekyll-docs]: https://jekyllrb.com/docs/home
