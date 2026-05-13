---
layout: default
permalink: /notes/
title: notes
nav: true
nav_order: 4
description: short academic notes — math, robotics, control, embedded.
---

<div class="post">

  <div class="header-bar">
    <h1>{{ page.title }}</h1>
    <h2>{{ page.description }}</h2>
  </div>

  <ul class="post-list">
    {% assign sorted_notes = site.notes | sort: "date" | reverse %}
    {% for note in sorted_notes %}
      {% assign read_time = note.content | number_of_words | divided_by: 180 | plus: 1 %}
      {% assign tags = note.tags | join: "" %}
      {% assign categories = note.categories | join: "" %}
      <li>
        <h3>
          <a class="post-title" href="{{ note.url | relative_url }}">{{ note.title }}</a>
        </h3>
        {% if note.description %}<p>{{ note.description }}</p>{% endif %}
        <p class="post-meta">
          {{ read_time }} min read &nbsp; &middot; &nbsp;
          {{ note.date | date: '%B %d, %Y' }}
        </p>
        {% if tags != "" or categories != "" %}
          <p class="post-tags">
            {% for tag in note.tags %}
              <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}{% unless forloop.last %} &nbsp; {% endunless %}
            {% endfor %}
            {% if tags != "" and categories != "" %} &nbsp; &middot; &nbsp; {% endif %}
            {% for category in note.categories %}
              <i class="fa-solid fa-tag fa-sm"></i> {{ category }}{% unless forloop.last %} &nbsp; {% endunless %}
            {% endfor %}
          </p>
        {% endif %}
      </li>
    {% endfor %}
  </ul>

</div>
