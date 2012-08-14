---
layout: post
category : javascript
title:  Javascript 安全
header:
tagline:
tags : [javascript, 安全]
---
{% include JB/setup %}

```html
<script>
  var str = "</script><script>alert('i'm flaw');</script>";
</script>
```