/* Restaurant policy checkup.
   File bytes and extracted text stay in this browser. Do not add a request that
   sends them anywhere. sms:, mailto:, and navigator.share hand a short summary
   to the visitor's own phone or mail app. Nothing here is coverage advice. */
(function () {
  'use strict';

  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
  var MONTH_NAME = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var LINES = [
    {
      id: 'gl',
      title: 'General liability',
      short: 'general liability',
      patterns: [/commercial general liability/i, /general liability/i, /\bCGL\b/i],
      why: 'A guest slips, or says the food made them sick. This is the line that usually answers.',
      lease: 'Leases often ask for this on the certificate, commonly at $1 million per occurrence. Yours may say something else. This is the usual pattern, not a reading of your lease.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'liquor',
      title: 'Liquor liability',
      short: 'liquor liability',
      patterns: [/liquor liability/i, /liquor legal/i, /dram shop/i, /alcohol liability/i],
      why: 'If you pour, general liability usually leaves the alcohol claim out. Beer and wine count.',
      lease: 'If you pour, some landlords ask for liquor liability. If you don’t, you can skip it. The lease is where that shows up.',
      href: '/blog/liquor-liability-type-41-type-47.html',
      linkLabel: 'Liquor liability, if you are getting a Type 41 or a Type 47'
    },
    {
      id: 'property',
      title: 'Property, building, and contents',
      short: 'property',
      patterns: [/business personal property/i, /\bBPP\b/, /building coverage/i, /improvements and betterments/i, /tenant improvements/i, /commercial property/i, /personal property of others/i, /\bbuilding\b[^$\n]{0,40}\$\s*[0-9]/i],
      why: 'The building if you own it, and your equipment, food, and buildout either way.',
      lease: 'If you lease, the landlord usually insures the building and asks you to insure your contents and improvements. If you own the building, the building limit is the one to read.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'bi',
      title: 'Business income and extra expense',
      short: 'business income',
      patterns: [/business income/i, /extra expense/i, /business interruption/i, /loss of business income/i],
      why: 'If you have to close after a covered loss, this is the lost income, with its own limit and its own waiting period. Property fixes the room. This is the sales you didn’t make.',
      lease: 'Some leases require business income. Many don’t. I’d still ask, because a closure is when the rent is still due.',
      href: '/blog/new-restaurant-insurance-california.html',
      linkLabel: 'What a new California restaurant actually needs'
    },
    {
      id: 'spoil',
      title: 'Spoilage and food contamination',
      short: 'spoilage',
      patterns: [/spoilage/i, /food contamination/i, /refrigerated products/i],
      why: 'Spoilage is the food that warms up when the walk-in dies. Food-contamination wording, when a policy has it, is closer to a health-department closure. Neither one is automatic, and they are easy to mix up.',
      lease: 'Usually optional. A lease can still name it. This is general information, not a reading of your lease.',
      href: '/blog/santa-ana-psps-walk-in.html',
      linkLabel: 'When Edison shuts the power off, the walk-in starts a clock'
    },
    {
      id: 'equip',
      title: 'Equipment breakdown',
      short: 'equipment breakdown',
      patterns: [/equipment breakdown/i, /boiler and machinery/i, /mechanical breakdown/i],
      why: 'Compressors, ice machines, and dishwashers fail on their own. A property form doesn’t always call that a covered cause of loss.',
      lease: 'Usually optional. A lease can still name it. This is general information, not a reading of your lease.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'utility',
      title: 'Utility services and off-premises power',
      short: 'off-premises power',
      patterns: [/utility services/i, /off[\s-]*premises/i, /overhead transmission/i],
      why: 'When the power fails off your premises, including an Edison shutoff, a lot of property forms don’t treat the spoiled food as their problem unless this is added.',
      lease: 'Usually optional. A lease can still name it. This is general information, not a reading of your lease.',
      href: '/blog/santa-ana-psps-walk-in.html',
      linkLabel: 'What a Santa Ana shutoff does to the walk-in'
    },
    {
      id: 'hnoa',
      title: 'Hired and non-owned auto',
      short: 'hired and non-owned auto',
      patterns: [/hired\s*(?:and|&|\/)\s*non[-\s]?owned/i, /non[-\s]?owned auto/i, /hired auto/i, /\bHNOA\b/],
      why: 'A manager or a driver using their own car for a drop. General liability usually stays at the restaurant.',
      lease: 'Usually optional, unless the lease talks about vehicles. This is general information, not a reading of your lease.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'auto',
      title: 'Commercial auto',
      short: 'commercial auto',
      patterns: [/commercial auto/i, /business auto/i],
      why: 'A car or van the restaurant owns. General liability doesn’t follow it, and hired and non-owned doesn’t replace it.',
      lease: 'If the lease mentions vehicles, it may ask for this. A lot of restaurant leases don’t.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'wc',
      title: 'Workers’ compensation',
      short: 'workers comp',
      patterns: [/workers?'?\s*compensation/i, /workers?'?\s*comp\b/i, /\bWCIRB\b/, /employers?'?\s*liability/i],
      why: 'A burn, a cut, a slip on the line. In California this starts with your first employee, part-time included, and it is often a separate policy from the package in your hand.',
      lease: 'Once you have an employee, California requires this. Leases often ask for it too.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'epli',
      title: 'Employment practices (EPLI)',
      short: 'EPLI',
      patterns: [/employment practices/i, /\bEPLI\b/, /employment-related practices/i],
      why: 'A firing, a schedule fight that becomes a complaint, a harassment claim. General liability isn’t built for that.',
      lease: 'Usually optional. A lease can still name it. This is general information, not a reading of your lease.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'assault',
      title: 'Assault and battery',
      short: 'assault and battery',
      patterns: [/assault\s*(?:and|&|or)\s*battery/i, /CG\s*40\s*51/i, /CG\s*35\s*09/i],
      why: 'A fight on the sidewalk or at the door. On a lot of 2026 forms this phrase takes the claim off the general liability policy, the liquor policy, or both. Worth asking whether yours covers it, excludes it, or caps it.',
      lease: 'This is a coverage question, not something most leases require. The certificate will not show it.',
      href: '/blog/california-restaurant-insurance-market.html',
      linkLabel: 'The market note, including the fight outside'
    },
    {
      id: 'umbrella',
      title: 'Umbrella',
      short: 'umbrella',
      patterns: [/umbrella/i, /excess liability/i],
      why: 'When a serious injury costs more than the liability limit, this sits on top. Some landlords ask. A lot of restaurants don’t carry it, and that’s a conversation, not a failing grade.',
      lease: 'Shopping-center leases sometimes ask for an umbrella. A lot of restaurant leases don’t.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'cyber',
      title: 'Cyber',
      short: 'cyber',
      patterns: [/\bcyber\b/i, /data breach/i, /network security/i],
      why: 'The card machine, online orders, a reservation login. A different problem than a grease fire, and usually optional.',
      lease: 'Usually optional. A lease can still name it. This is general information, not a reading of your lease.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'crime',
      title: 'Crime and employee dishonesty',
      short: 'employee dishonesty',
      patterns: [/employee dishonesty/i, /money and securities/i, /commercial crime/i, /crime coverage/i],
      why: 'The deposit, the till, an employee who pockets the close. Different from a guest stealing a coat.',
      lease: 'Usually optional. A lease can still name it. This is general information, not a reading of your lease.',
      href: '',
      linkLabel: ''
    },
    {
      id: 'sign',
      title: 'Sign coverage',
      short: 'sign coverage',
      patterns: [/sign coverage/i, /outdoor signs?/i, /coverage for signs?/i, /\bsigns?\s*[:\-]\s*\$/i],
      why: 'The blade sign and the letters out front are easy to leave off, or to cap at a number that wouldn’t replace them.',
      lease: 'Usually optional. A lease can still name it, especially in a center with sign rules.',
      href: '',
      linkLabel: ''
    }
  ];

  var ORDER = { gl: 10, liquor: 20, property: 30, bi: 40, spoil: 50, utility: 60, equip: 70, hnoa: 80, auto: 90, wc: 100, epli: 110, assault: 45, umbrella: 130, cyber: 140, crime: 150, sign: 160 };
  var CARRIERS = [
    'California FAIR Plan', 'FAIR Plan', 'Society Insurance', 'The Hartford', 'Hartford',
    'Travelers', 'Liberty Mutual', 'Nationwide', 'Philadelphia Insurance', 'Great American',
    'Auto-Owners', 'State Farm', 'Farmers Insurance', 'AmTrust', 'Markel', 'CNA', 'Chubb',
    'Zurich', 'Hiscox', 'NEXT Insurance', 'biBERK', 'Berkshire Hathaway', 'Golden Bear',
    'Capital Insurance Group', 'CompWest', 'Insurance Company of the West', 'Berkley',
    'USLI', 'Kinsale', 'Scottsdale', 'Acuity', 'Westfield', 'Cincinnati Insurance',
    'Donegal', 'Encova', 'Selective Insurance', 'Hanover Insurance', 'Utica', 'Frankenmuth',
    'Federated Insurance', 'Sentry Insurance', 'Tokio Marine', 'Crum & Forster', 'GuideOne',
    'Church Mutual', 'Mercury Insurance', 'Allied World', 'Colony Insurance', 'James River',
    'Atlantic Casualty', 'Century Surety', 'Mesa Underwriters', "Lloyd's", 'Lloyds',
    'Pie Insurance', 'Employers Mutual', 'Guard Insurance', 'Main Street America', 'State Compensation Insurance Fund'
  ].sort(function (a, b) { return b.length - a.length; });

  function ctxOf(c) {
    c = c || {};
    return {
      place: c.place || '',
      alcohol: c.alcohol || '',
      space: c.space || '',
      staff: c.staff || '',
      delivery: c.delivery || '',
      walkin: c.walkin || '',
      renew: c.renew || '',
      hope: c.hope || ''
    };
  }

  function pours(ctx) {
    if (ctx.alcohol === 'bw' || ctx.alcohol === 'full') return true;
    if (ctx.alcohol === 'no') return false;
    if (!ctx.alcohol && (ctx.place === 'bar' || ctx.place === 'brewery')) return true;
    return null;
  }

  function lineById(id) {
    for (var i = 0; i < LINES.length; i++) if (LINES[i].id === id) return LINES[i];
    return null;
  }

  function eachMatch(re, text, fn) {
    var flags = re.flags.indexOf('g') >= 0 ? re.flags : re.flags + 'g';
    if (flags.indexOf('i') < 0 && re.flags.indexOf('i') >= 0) flags += 'i';
    var r = new RegExp(re.source, flags);
    var m;
    while ((m = r.exec(text))) {
      fn(m);
      if (m.index === r.lastIndex) r.lastIndex++;
    }
  }

  function lineContext(text, index) {
    var start = text.lastIndexOf('\n', Math.max(0, index - 1)) + 1;
    var end = text.indexOf('\n', index);
    if (end < 0) end = text.length;
    var line = text.slice(start, end).trim();
    if (line.length >= 48) return line;
    /* A short line that already names a limit or a yes/no is complete.
       The next row is often a different coverage, and its exclusion
       wording should not cancel this one. */
    if (/\$\s*[0-9]|\bincluded\b|\bexcluded\b|\bexclusion\b|not covered|not included/i.test(line)) return line;
    var nextEnd = text.indexOf('\n', end + 1);
    var next = text.slice(end + 1, nextEnd < 0 ? Math.min(text.length, end + 160) : nextEnd).trim();
    if (!next) return line;
    if (/^(?:CG|IL|CP|BP|CA)\s*\d/i.test(next)) return line;
    return (line + ' ' + next).trim();
  }

  function judge(line, id) {
    var s = line.toLowerCase();
    if (id === 'assault') {
      if (/exclu|not included|cg\s*40\s*51|cg\s*35\s*09/.test(s)) return 'negated';
      return 'uncertain';
    }
    if (/buy[-\s]?back|exclusion deleted|exclusion removed|added back/.test(s)) return 'uncertain';
    if (/not included|\bexcluded\b|\bexclusion\b|does not apply|do not apply|doesn't apply|not covered|no coverage/.test(s)) return 'negated';
    return 'found';
  }

  function fmtMoney(raw, min) {
    var n = String(raw || '').replace(/[^\d]/g, '');
    if (!n) return '';
    var v = Number(n);
    if (!isFinite(v) || v < (min || 500)) return '';
    return '$' + v.toLocaleString('en-US');
  }

  function grabMoney(slice, re, min) {
    var m = slice.match(re);
    return m ? fmtMoney(m[1], min) : '';
  }

  function glLimits(text, index) {
    var slice = text.slice(Math.max(0, index), index + 900);
    var occ = grabMoney(slice, /(?:each|per)\s+occurrence[^$]{0,80}\$\s*([0-9][0-9,]*)/i, 10000)
      || grabMoney(slice, /\$\s*([0-9][0-9,]*)\s+(?:each|per)\s+occurrence/i, 10000);
    var agg = grabMoney(slice, /general\s+aggregate[^$]{0,80}\$\s*([0-9][0-9,]*)/i, 10000)
      || grabMoney(slice, /\$\s*([0-9][0-9,]*)\s+general\s+aggregate/i, 10000);
    if (!occ || !agg) {
      var pair = slice.match(/\$\s*([0-9][0-9,]*)\s*\/\s*\$\s*([0-9][0-9,]*)/);
      if (pair) {
        if (!occ) occ = fmtMoney(pair[1], 10000);
        if (!agg) agg = fmtMoney(pair[2], 10000);
      }
    }
    if (occ && agg) return 'It looks like ' + occ + ' each occurrence and ' + agg + ' aggregate, if I read the line right.';
    if (occ) return 'It looks like ' + occ + ' each occurrence, if I read the line right. I didn’t catch a clean aggregate.';
    if (agg) return 'I saw an aggregate of ' + agg + ', if I read the line right. I didn’t catch a clean per-occurrence limit.';
    return '';
  }

  function nearbyMoney(text, index) {
    var start = text.lastIndexOf('\n', Math.max(0, index - 1)) + 1;
    var slice = text.slice(start, index + 160);
    var m = slice.match(/\$\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,})/);
    return m ? fmtMoney(m[1], 500) : '';
  }

  function scanLine(text, line) {
    var best = null;
    var sawNeg = false;
    var sawAny = false;
    var first = -1;
    var rank = { found: 3, uncertain: 2, negated: 1 };
    line.patterns.forEach(function (re) {
      eachMatch(re, text, function (m) {
        var ctxLine = lineContext(text, m.index);
        var status = judge(ctxLine, line.id);
        sawAny = true;
        if (status === 'negated') sawNeg = true;
        if (first < 0) first = m.index;
        if (!best || rank[status] > rank[best.status]) best = { status: status, index: m.index };
      });
    });
    if (line.id === 'gl' && !sawAny && /each occurrence/i.test(text) && /general aggregate/i.test(text)) {
      var at = text.search(/each occurrence/i);
      best = { status: 'found', index: at < 0 ? 0 : at };
      sawAny = true;
    }
    if (!sawAny || !best) return { status: 'absent', index: -1, limits: '', money: '' };
    if (line.id === 'assault') best = { status: sawNeg ? 'negated' : 'uncertain', index: first };
    var limits = '';
    var money = '';
    if (line.id === 'gl' && best.status === 'found') limits = glLimits(text, best.index);
    else money = nearbyMoney(text, best.index);
    return { status: best.status, index: best.index, limits: limits, money: money };
  }

  function detect(text) {
    var out = {};
    LINES.forEach(function (line) { out[line.id] = scanLine(text, line); });
    return out;
  }

  function parseDateToken(raw) {
    var s = String(raw || '').replace(/\s+/g, ' ').trim();
    var m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    var y;
    var d;
    if (m) {
      y = +m[3];
      if (y < 100) y += y < 50 ? 2000 : 1900;
      d = new Date(y, +m[1] - 1, +m[2]);
      if (d.getFullYear() === y && d.getMonth() === +m[1] - 1 && d.getDate() === +m[2] && y >= 1990 && y <= 2045) return d;
      return null;
    }
    var m2 = s.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/i);
    if (!m2) return null;
    var mon = MONTHS[m2[1].toLowerCase()];
    y = +m2[3];
    d = new Date(y, mon, +m2[2]);
    if (d.getFullYear() === y && d.getMonth() === mon && d.getDate() === +m2[2] && y >= 1990 && y <= 2045) return d;
    return null;
  }

  function findDateTokens(text) {
    var re = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\b/ig;
    var found = [];
    var m;
    while ((m = re.exec(text))) {
      var d = parseDateToken(m[1]);
      if (d) found.push({ index: m.index, date: d });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    return found;
  }

  function labelDate(d) {
    if (!d) return '';
    return MONTH_NAME[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function pickPeriod(text, dates) {
    function near(labelRe, span) {
      var idx = text.search(labelRe);
      if (idx < 0) return null;
      var hits = dates.filter(function (d) { return d.index >= idx && d.index < idx + span; });
      return hits.length ? hits[0].date : null;
    }
    var periodAt = text.search(/policy\s+period/i);
    if (periodAt >= 0) {
      var windowDates = dates.filter(function (d) { return d.index > periodAt && d.index < periodAt + 220; });
      if (windowDates.length >= 2) return orderPair(windowDates[0].date, windowDates[1].date);
    }
    var eff = near(/\beffective(?:\s+date)?\b|\binception\b/i, 90);
    var exp = near(/\bexpir(?:ation|es)(?:\s+date)?\b|\brenewal date\b/i, 90);
    if (eff && exp) return orderPair(eff, exp);
    var i;
    var j;
    for (i = 0; i < dates.length; i++) {
      for (j = i + 1; j < dates.length && j < i + 4; j++) {
        var days = Math.abs(dates[j].date - dates[i].date) / 86400000;
        if (days >= 300 && days <= 400) return orderPair(dates[i].date, dates[j].date);
      }
    }
    return { effective: eff, expiration: exp };
  }

  function orderPair(a, b) {
    if (a && b && b < a) return { effective: b, expiration: a };
    return { effective: a || null, expiration: b || null };
  }

  function daysUntil(d) {
    var now = new Date();
    var a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    var b = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.round((b - a) / 86400000);
  }

  function renewalFromDates(period) {
    var eff = period.effective;
    var exp = period.expiration;
    if (!eff && !exp) {
      return {
        title: 'The date',
        body: 'I couldn’t find an effective or expiration date. It’s usually near the top of the dec page. Whenever it is, I’d read the policy about 60 days before it renews, while a change can still be made.'
      };
    }
    var bits = [];
    if (eff && exp) bits.push('If I read the date right, this runs from ' + labelDate(eff) + ' through ' + labelDate(exp) + '.');
    else if (exp) bits.push('The end date I could read is ' + labelDate(exp) + '.');
    else bits.push('The start date I could read is ' + labelDate(eff) + '. I didn’t catch the end date.');
    if (exp) {
      var days = daysUntil(exp);
      var look = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());
      look.setDate(look.getDate() - 60);
      if (days < 0) bits.push('That end date is already past. If you renewed, the new dec page is the one to read. If you didn’t, that’s the first thing to text me.');
      else if (days <= 60) bits.push('That end date is inside 60 days. This is the useful window to ask the questions below, while a change can still be made.');
      else bits.push('I’d look again around ' + labelDate(look) + ', about 60 days before it renews, while a change can still be made.');
    }
    return { title: 'The date', body: bits.join(' ') };
  }

  function renewalFromAnswers(ctx) {
    var map = {
      soon: 'You said the renewal is inside 60 days. That’s the window where a change can still be made.',
      later: 'You said the renewal is later. The useful time to look is about 60 days before it, not the night the bill shows up.',
      opening: 'You’re opening, so there may not be a renewal yet. The lease usually wants a certificate before the keys.',
      unknown: 'If you don’t know the month, it’s near the top of the dec page. I’d read the policy about 60 days before that date.'
    };
    return {
      title: 'The date',
      body: map[ctx.renew] || 'Whenever the policy renews, I’d look about 60 days before, while a change can still be made.'
    };
  }

  function cleanCarrier(s) {
    if (!s) return '';
    var t = String(s).replace(/\s+/g, ' ').trim();
    t = t.split(/\b(?:NAIC|policy number|named insured|effective|expir)/i)[0].trim();
    t = t.replace(/[\s,;:|\-]+$/g, '').trim();
    if (t.length < 4 || t.length > 70) return '';
    if (/shaw,\s*moses/i.test(t)) return '';
    if (!/[A-Za-z]{3,}/.test(t)) return '';
    if (/^(see|refer|various|as follows|the company|your company|our company)$/i.test(t)) return '';
    return t;
  }

  function findCarrier(text) {
    var labeled = text.match(/\b(?:carrier|insurer|underwritten by|issued by)\b\s*[:\-]\s*([^\n]{3,100})/i);
    var fromLabel = labeled ? cleanCarrier(labeled[1]) : '';
    if (fromLabel) return fromLabel;
    var i;
    for (i = 0; i < CARRIERS.length; i++) {
      var name = CARRIERS[i];
      var re = new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (re.test(text)) return name;
    }
    var generic = text.match(/\b([A-Z][A-Za-z0-9&.'’\-]+(?:\s+[A-Z][A-Za-z0-9&.'’\-]+){0,5}\s+Insurance\s+Company)\b/);
    if (generic && !/shaw,\s*moses/i.test(generic[1])) return generic[1];
    return '';
  }

  function confidenceOf(text, det, period) {
    var len = text.trim().length;
    var found = 0;
    Object.keys(det).forEach(function (id) {
      if (id === 'assault' || id === 'auto') return;
      if (det[id].status === 'found') found++;
    });
    if (len < 60) return 'low';
    if (found === 0 && !period.expiration && !period.effective && len < 400) return 'low';
    if (found >= 2 || period.expiration || period.effective) return 'high';
    return 'medium';
  }

  function rankOf(id, ctx) {
    var r = ORDER[id] != null ? ORDER[id] : 200;
    if (id === 'liquor' && pours(ctx) === true) r -= 12;
    if (id === 'hnoa' && (ctx.delivery === 'staff' || ctx.delivery === 'both')) r -= 55;
    if (id === 'auto' && (ctx.delivery === 'own' || ctx.delivery === 'both')) r -= 28;
    if ((id === 'spoil' || id === 'utility') && ctx.walkin === 'yes') r -= 16;
    if (id === 'wc' && (ctx.staff === '1' || ctx.staff === '11')) r -= 6;
    return r;
  }

  function whyFor(line, ctx) {
    if (line.id === 'property') {
      if (ctx.space === 'own') return 'The building, the kitchen, and the food you already paid for.';
      if (ctx.space === 'lease') return 'Your equipment, the food, and the buildout you paid for. The landlord’s policy usually covers their building, not your lowboys.';
    }
    return line.why;
  }

  function extraClause(id, ctx) {
    if (id === 'liquor' && ctx.alcohol === 'bw') return ' You said beer and wine. That still counts.';
    if (id === 'liquor' && ctx.alcohol === 'full') return ' You said it’s a full bar.';
    if (id === 'hnoa' && (ctx.delivery === 'staff' || ctx.delivery === 'both')) return ' You said staff use their own cars.';
    if (id === 'auto' && (ctx.delivery === 'own' || ctx.delivery === 'both')) return ' You said there’s a car or van in the business.';
    if (id === 'wc' && (ctx.staff === '1' || ctx.staff === '11')) return ' You said you have employees.';
    if (id === 'spoil' && ctx.walkin === 'yes') return ' You said the walk-in is full.';
    if ((id === 'spoil' || id === 'equip' || id === 'utility') && ctx.walkin === 'no') return ' You said there isn’t much food on hand, so this is a smaller question.';
    if (id === 'epli' && ctx.staff === '0') return ' You said it’s just the owners for now, so this waits until you hire.';
    if (id === 'hnoa' && ctx.delivery === 'none') return ' You said nobody drives for the restaurant. If that stays true, this is a small question.';
    return '';
  }

  function sawUpload(line, d, ctx) {
    var s;
    if (line.id === 'assault') {
      if (d.status === 'negated') s = 'Worth asking. I saw assault-and-battery language that looks like an exclusion. On a lot of 2026 restaurant forms, that takes a fight off the policy. Ask whether yours excludes it, caps it, or still covers it.';
      else if (d.status === 'uncertain') s = 'Worth asking. I saw the words assault and battery, and I can’t tell if that’s coverage, a cap, or an exclusion. Ask them to show you the page. The certificate will not say.';
      else s = 'Not found on what you uploaded. Exclusions often sit on a form that isn’t on the dec page. Worth asking whether a fight is covered, excluded, or capped.';
      return s;
    }
    if (d.status === 'found') {
      s = 'Found on what you uploaded.';
      if (d.limits) s += ' ' + d.limits;
      else if (d.money) s += ' I saw ' + d.money + ' nearby.';
      if (line.id === 'liquor' && ctx.alcohol === 'no') s += ' You also said you don’t pour, so it’s fair to ask whether you still want this line.';
      return s + extraClause(line.id, ctx);
    }
    if (d.status === 'negated' || d.status === 'uncertain') {
      return 'Worth asking. I saw the words, next to language that may take the coverage off or limit it. I can’t tell from this page which way it goes.' + extraClause(line.id, ctx);
    }
    if (line.id === 'wc') return 'Not found on what you uploaded. Workers’ comp is often its own policy, so this may be the wrong page. That is not the same as going without it.' + extraClause(line.id, ctx);
    return 'Not found on what you uploaded. That is not the same as missing from the policy. A dec page leaves things off.' + extraClause(line.id, ctx);
  }

  function stateOf(status) {
    if (status === 'found') return 'found';
    if (status === 'absent') return 'not_found';
    return 'worth_asking';
  }

  function uploadBucket(id, status, ctx, confidence) {
    if (id === 'assault') return confidence === 'low' ? 'hide' : 'ask';
    if (id === 'auto') {
      if (status === 'found') return 'solid';
      if (status === 'negated' || status === 'uncertain') return 'ask';
      if (ctx.delivery === 'own' || ctx.delivery === 'both') return 'ask';
      return 'hide';
    }
    if (status === 'found') return 'solid';
    if (confidence === 'low') return 'hide';
    if (status === 'negated' || status === 'uncertain') return 'ask';
    if (id === 'liquor' && ctx.alcohol === 'no') return 'quiet';
    if (id === 'hnoa' && ctx.delivery === 'none') return 'optional';
    if ((id === 'spoil' || id === 'equip' || id === 'utility') && ctx.walkin === 'no') return 'optional';
    if (id === 'epli' && ctx.staff === '0') return 'optional';
    if (id === 'cyber' || id === 'crime' || id === 'sign') return 'optional';
    return 'ask';
  }

  function makeUploadItem(line, d, ctx, confidence) {
    return {
      id: line.id,
      title: line.title,
      short: line.short,
      state: stateOf(d.status),
      saw: sawUpload(line, d, ctx),
      why: whyFor(line, ctx),
      lease: line.lease,
      href: line.href,
      linkLabel: line.linkLabel,
      bucket: uploadBucket(line.id, d.status, ctx, confidence),
      rank: rankOf(line.id, ctx)
    };
  }

  function facts(ctx) {
    var p = [];
    var place = { restaurant: 'a restaurant', bar: 'a bar', cafe: 'a café', brewery: 'a brewery' };
    if (ctx.place && place[ctx.place]) p.push(place[ctx.place]);
    if (ctx.alcohol === 'no') p.push('no alcohol');
    if (ctx.alcohol === 'bw') p.push('beer and wine');
    if (ctx.alcohol === 'full') p.push('a full bar');
    if (ctx.space === 'lease') p.push('leases the space');
    if (ctx.space === 'own') p.push('owns the building');
    if (ctx.staff === '0') p.push('no employees');
    if (ctx.staff === '1') p.push('1–10 employees');
    if (ctx.staff === '11') p.push('11 or more employees');
    if (ctx.delivery === 'none') p.push('no driving for the business');
    if (ctx.delivery === 'own') p.push('has a vehicle');
    if (ctx.delivery === 'staff') p.push('staff drive their own cars');
    if (ctx.delivery === 'both') p.push('owns a vehicle and staff drive theirs');
    if (ctx.walkin === 'yes') p.push('a full walk-in');
    if (ctx.walkin === 'some') p.push('some food on hand');
    if (ctx.walkin === 'no') p.push('almost no food stock');
    return p.join(', ');
  }

  function questionBucket(id, ctx) {
    if (id === 'auto') return (ctx.delivery === 'own' || ctx.delivery === 'both') ? 'ask' : 'hide';
    if (id === 'gl' || id === 'property') return 'solid';
    if (id === 'liquor') {
      if (pours(ctx) === true) return 'solid';
      if (pours(ctx) === false) return 'quiet';
      return 'ask';
    }
    if (id === 'wc') return (ctx.staff === '1' || ctx.staff === '11') ? 'solid' : 'ask';
    if (id === 'hnoa' && ctx.delivery === 'none') return 'optional';
    if ((id === 'spoil' || id === 'equip' || id === 'utility') && ctx.walkin === 'no') return 'optional';
    if (id === 'epli' && ctx.staff === '0') return 'optional';
    if (id === 'cyber' || id === 'crime' || id === 'sign') return 'optional';
    return 'ask';
  }

  function sawQuestions(line, ctx, bucket) {
    if (bucket === 'quiet' && line.id === 'liquor') return 'You said you don’t serve alcohol, so I wouldn’t chase liquor liability unless that changes.';
    if (bucket === 'solid') {
      if (line.id === 'liquor') {
        var bit = ctx.alcohol === 'bw' ? ' Beer and wine count.' : '';
        if (!ctx.alcohol && (ctx.place === 'bar' || ctx.place === 'brewery')) bit = ' I treated a ' + (ctx.place === 'bar' ? 'bar' : 'brewery') + ' as a place that pours. Change that above if it’s wrong.';
        return 'I’d start here. You serve alcohol, and general liability usually leaves that claim out.' + bit;
      }
      if (line.id === 'wc') return 'I’d start here. You have employees, and in California this starts with the first one, part-time included.';
      if (line.id === 'property' && ctx.space === 'own') return 'I’d start here. You own the building, so the building limit matters along with what’s inside.';
      if (line.id === 'property' && ctx.space === 'lease') return 'I’d start here. The lease usually wants your contents and your buildout insured.';
      if (line.id === 'gl') return 'I’d start here. Guest injuries and “your food made me sick” claims live on this line.';
      return 'I’d start here for a place like yours.';
    }
    if (line.id === 'assault') return 'Worth asking whether a fight is covered, excluded, or capped. The certificate will not say, and a lot of 2026 forms take it off.';
    if (line.id === 'wc') return 'The day you hire, even part-time, California requires this. Until then it can wait.';
    if (line.id === 'liquor') return 'Worth asking if you pour. Beer and wine count. If you don’t serve alcohol, you can skip it.';
    if (line.id === 'hnoa' && (ctx.delivery === 'staff' || ctx.delivery === 'both')) return 'Worth asking. You said staff drive their own cars. General liability usually doesn’t follow that car.';
    if (line.id === 'auto') return 'Worth asking. A vehicle the business owns is usually its own policy.';
    if (line.id === 'bi') return 'Worth asking what the limit is, and how long the waiting period is, before you need it.';
    return 'Worth asking. This matches the way you described the place. It is not a finding that you lack it.' + extraClause(line.id, ctx);
  }

  function pack(items, extra) {
    items.sort(function (a, b) { return a.rank - b.rank; });
    function take(bucket) { return items.filter(function (it) { return it.bucket === bucket; }); }
    return Object.assign({
      solid: take('solid'),
      ask: take('ask'),
      optional: take('optional'),
      quiet: take('quiet')
    }, extra);
  }

  function itemShell(line, ctx, bucket, saw, state) {
    return {
      id: line.id,
      title: line.title,
      short: line.short,
      state: state,
      saw: saw,
      why: whyFor(line, ctx),
      lease: line.lease,
      href: line.href,
      linkLabel: line.linkLabel,
      bucket: bucket,
      rank: rankOf(line.id, ctx)
    };
  }

  function analyzeText(text, ctx) {
    text = String(text || '').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n');
    ctx = ctxOf(ctx);
    var det = detect(text);
    var dates = findDateTokens(text);
    var period = pickPeriod(text, dates);
    var confidence = confidenceOf(text, det, period);
    var items = LINES.map(function (line) {
      return makeUploadItem(line, det[line.id], ctx, confidence);
    });
    var carrier = confidence === 'low' ? (findCarrier(text) || '') : findCarrier(text);
    return pack(items, {
      mode: 'upload',
      confidence: confidence,
      carrier: carrier,
      effectiveLabel: labelDate(period.effective),
      expirationLabel: labelDate(period.expiration),
      renewal: renewalFromDates(period),
      facts: facts(ctx),
      premium: ctx.hope === 'premium',
      inferredPour: !ctx.alcohol && (ctx.place === 'bar' || ctx.place === 'brewery')
    });
  }

  function analyzeAnswers(ctx) {
    ctx = ctxOf(ctx);
    var items = LINES.map(function (line) {
      var bucket = questionBucket(line.id, ctx);
      var state = bucket === 'solid' ? 'start' : 'worth_asking';
      return itemShell(line, ctx, bucket, sawQuestions(line, ctx, bucket), state);
    });
    return pack(items, {
      mode: 'questions',
      confidence: 'high',
      carrier: '',
      effectiveLabel: '',
      expirationLabel: '',
      renewal: renewalFromAnswers(ctx),
      facts: facts(ctx),
      premium: ctx.hope === 'premium',
      inferredPour: !ctx.alcohol && (ctx.place === 'bar' || ctx.place === 'brewery')
    });
  }

  function smsBody(result) {
    if (!result) return 'Hi Sam, I own [restaurant] in [city] and have a question about my insurance.';
    if (result.mode === 'upload' && result.confidence === 'low') {
      return 'Hi Sam, I tried the policy checkup and the page could not read the file. I will send a photo of the dec page. I own [restaurant] in [city].';
    }
    var flagged = result.ask.map(function (it) { return it.short; });
    if (!flagged.length) flagged = result.optional.map(function (it) { return it.short; });
    function build(list) {
      var ask = list.length
        ? 'Worth asking about: ' + list.join(', ') + (flagged.length > list.length ? ', and more' : '') + '.'
        : 'Nothing major flagged on what I could read.';
      var parts = ['Hi Sam, I used the policy checkup on your site.'];
      if (result.mode === 'questions' && result.facts) parts.push('No file. ' + result.facts + '.');
      else if (result.mode === 'upload' && result.facts) parts.push('Notes: ' + result.facts + '.');
      parts.push(ask);
      if (result.expirationLabel) parts.push('Renewal date I could read: ' + result.expirationLabel + '.');
      parts.push('I own [restaurant] in [city]. Can we look at it?');
      return parts.join(' ');
    }
    var list = flagged.slice(0, 6);
    var body = build(list);
    while (body.length > 420 && list.length > 2) {
      list.pop();
      body = build(list);
    }
    return body;
  }

  function shareText(result) {
    if (!result) return 'I used Sam Johnson’s restaurant policy checkup. General information, not advice.';
    var lines = [];
    lines.push('Restaurant policy checkup');
    lines.push('General information, not advice, and not a quote. Sam Johnson, Shaw, Moses, Mendenhall & Associates Insurance, Monrovia. CA License #4536079. 626-799-7813.');
    lines.push('');
    if (result.mode === 'questions') lines.push('No file was read. This note is from the questions, not from a policy.');
    else if (result.confidence === 'low') lines.push('A file was chosen, and the page could not read enough of it to trust a list. The file stayed on the phone.');
    else lines.push('A declarations page was read on the owner’s device. This note lists what the page flagged. It is not the policy, and it does not include the file.');
    if (result.facts) lines.push('How they described the place: ' + result.facts + '.');
    if (result.carrier) lines.push('Carrier the page could read: ' + result.carrier);
    if (result.effectiveLabel || result.expirationLabel) lines.push('Dates the page could read: ' + (result.effectiveLabel || 'not found') + ' through ' + (result.expirationLabel || 'not found') + '.');
    if (result.renewal && result.renewal.body) lines.push(result.renewal.body);
    lines.push('');
    lines.push('What looked solid:');
    if (!result.solid.length) lines.push('- Nothing listed.');
    result.solid.forEach(function (it) { lines.push('- ' + it.title + '. ' + it.saw); });
    lines.push('');
    lines.push('Worth asking about:');
    if (!result.ask.length) lines.push('- Nothing flagged.');
    result.ask.forEach(function (it) { lines.push('- ' + it.title + '. ' + it.saw); });
    if (result.optional.length) {
      lines.push('');
      lines.push('Usually optional:');
      result.optional.forEach(function (it) { lines.push('- ' + it.title + '. ' + it.saw); });
    }
    if (result.quiet.length) {
      lines.push('');
      lines.push('Set aside:');
      result.quiet.forEach(function (it) { lines.push('- ' + it.title + '. ' + it.saw); });
    }
    lines.push('');
    lines.push('Coverage depends on the policy forms. A dec page does not list everything. The page can miss a line or misread one.');
    return lines.join('\n');
  }

  var api = {
    analyzeText: analyzeText,
    analyzeAnswers: analyzeAnswers,
    smsBody: smsBody,
    shareText: shareText
  };
  var g = typeof window !== 'undefined' ? window : globalThis;
  g.SJCheck = api;

  if (typeof document === 'undefined') return;

  var PDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDF_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var TESS_SRC = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  var HEIC_SRC = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
  var MAX_BYTES = 20 * 1024 * 1024;
  var SMS_BASE = 'sms:+12056392604?&body=';
  var GENERIC_SMS = 'Hi Sam, I own [restaurant] in [city] and have a question about my insurance.';

  var lastResult = null;
  var lastText = '';
  var view = 'none';
  var job = 0;
  var stepIndex = -1;
  var statusExtra = '';
  var ocrWorker = null;
  var ocrLog = function () {};
  var pdfLoading = null;
  var tessLoading = null;

  var CHECK_STEPS = [
    'Checking general liability…',
    'Checking liquor liability…',
    'Checking property and business income…',
    'Checking spoilage and the walk-in…',
    'Checking equipment breakdown and off-premises power…',
    'Checking hired and non-owned auto…',
    'Checking workers’ comp and employment claims…',
    'Checking assault and battery language…',
    'Looking for the carrier and the renewal date…'
  ];

  function boot() {
    if (!document.getElementById('pc-app')) return;
    var file = document.getElementById('pc-file');
    var cam = document.getElementById('pc-cam');
    var drop = document.getElementById('pc-drop');
    var qform = document.getElementById('pc-qform');
    var refine = document.getElementById('pc-refine');
    file.addEventListener('change', function () { if (file.files && file.files[0]) handleFile(file.files[0]); });
    cam.addEventListener('change', function () { if (cam.files && cam.files[0]) handleFile(cam.files[0]); });
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('on'); });
    drop.addEventListener('dragleave', function () { drop.classList.remove('on'); });
    drop.addEventListener('drop', function (e) {
      e.preventDefault();
      drop.classList.remove('on');
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
    qform.addEventListener('change', function () {
      setCount();
      if (view === 'questions') render(analyzeAnswers(readQuestions()), { quiet: true });
    });
    qform.addEventListener('submit', function (e) {
      e.preventDefault();
      var ctx = readQuestions();
      if (!answeredCount(ctx)) {
        setError('Tap a few answers first. Even three is enough to start.');
        return;
      }
      setError('');
      view = 'questions';
      render(analyzeAnswers(ctx));
    });
    refine.addEventListener('change', function () {
      if (view !== 'upload' || !lastText) return;
      var result = analyzeText(lastText, readRefine());
      result.pagesNote = lastResult && lastResult.pagesNote || '';
      render(result, { quiet: true });
    });
    document.getElementById('pc-slip').addEventListener('click', function (e) {
      if (e.target && e.target.id === 'pc-reset') resetAll();
    });
    document.getElementById('pc-share').addEventListener('click', onShare);
    setCount();
    updateOutbound(null);
  }

  function setCount() {
    var n = answeredCount(readQuestions());
    var el = document.getElementById('pc-qcount');
    if (el) el.textContent = n + ' of 8 answered';
  }

  function val(form, name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }

  function readQuestions() {
    var form = document.getElementById('pc-qform');
    return {
      place: val(form, 'place'),
      alcohol: val(form, 'alc'),
      space: val(form, 'space'),
      staff: val(form, 'staff'),
      delivery: val(form, 'drive'),
      walkin: val(form, 'walk'),
      renew: val(form, 'renew'),
      hope: val(form, 'hope')
    };
  }

  function readRefine() {
    var form = document.getElementById('pc-refine');
    return {
      alcohol: val(form, 'r-alc'),
      space: val(form, 'r-space'),
      staff: val(form, 'r-staff'),
      delivery: val(form, 'r-drive'),
      walkin: val(form, 'r-walk')
    };
  }

  function answeredCount(ctx) {
    return ['place', 'alcohol', 'space', 'staff', 'delivery', 'walkin', 'renew', 'hope'].filter(function (k) { return ctx[k]; }).length;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('load')); };
      document.head.appendChild(s);
    });
  }

  function loadPdf() {
    if (window.pdfjsLib) return Promise.resolve();
    if (!pdfLoading) {
      pdfLoading = loadScript(PDF_SRC).then(function () {
        if (!window.pdfjsLib) throw new Error('load');
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER;
      });
    }
    return pdfLoading;
  }

  function loadTess() {
    if (window.Tesseract) return Promise.resolve();
    if (!tessLoading) tessLoading = loadScript(TESS_SRC);
    return tessLoading;
  }

  function kindOf(file) {
    var t = (file.type || '').toLowerCase();
    var n = (file.name || '').toLowerCase();
    if (t === 'application/pdf' || /\.pdf$/.test(n)) return 'pdf';
    if (/heic|heif/.test(t) || /\.heic$|\.heif$/.test(n)) return 'heic';
    if (t.indexOf('image/') === 0 || /\.(jpe?g|png|webp|gif|bmp|tiff?)$/.test(n)) return 'image';
    return '';
  }

  function setBusy(on) {
    document.getElementById('pc-app').classList.toggle('is-busy', on);
    document.getElementById('pc-file').disabled = on;
    document.getElementById('pc-cam').disabled = on;
  }

  function setError(msg) {
    var el = document.getElementById('pc-error');
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function setLive(text) {
    document.getElementById('pc-live').textContent = text || '';
  }

  function showSteps(active, extra) {
    stepIndex = active;
    if (extra != null) statusExtra = extra;
    var html = '';
    if (statusExtra) html += '<p class="pc-now">' + esc(statusExtra) + '</p>';
    if (active >= 0) {
      html += '<ol class="pc-steps">' + CHECK_STEPS.map(function (s, i) {
        var cls = i < active ? ' class="done"' : i === active ? ' class="on"' : '';
        return '<li' + cls + '>' + s + '</li>';
      }).join('') + '</ol>';
    }
    var el = document.getElementById('pc-status');
    if (el) el.innerHTML = html;
    var live = statusExtra || (active >= 0 && active < CHECK_STEPS.length ? CHECK_STEPS[active] : '');
    setLive(live);
  }

  function watchSteps(mine) {
    var i = 0;
    showSteps(0, 'Reading the file on this device…');
    var timer = setInterval(function () {
      if (mine !== job) { clearInterval(timer); return; }
      if (i < CHECK_STEPS.length - 1) {
        i += 1;
        showSteps(i);
      }
    }, 450);
    return function stop() { clearInterval(timer); };
  }

  function humanize(err) {
    var name = err && err.name || '';
    var m = err && err.message ? String(err.message) : '';
    if (name === 'PasswordException' || /password/i.test(m)) {
      return 'That PDF is password-protected. This page can’t open it, and it won’t send it anywhere to try. Save a copy without a password, or answer the eight questions.';
    }
    if (name === 'InvalidPDFException' || /invalid pdf/i.test(m)) {
      return 'That doesn’t look like a PDF I can open. Export it again, or take a photo of the dec page. Your file was not uploaded.';
    }
    if (m === 'heic') {
      return 'I can’t read this HEIC photo in this browser. On an iPhone, save it as a JPEG, or use Take a photo. Your file was not uploaded.';
    }
    if (m === 'type') {
      return 'Use a PDF or a photo: JPG, PNG, or HEIC. Your file was not uploaded.';
    }
    if (m === 'size') {
      return 'That file is over 20 megabytes. Photograph the declarations page, the first page or two, instead of the whole policy. Your file was not uploaded.';
    }
    if (m === 'image') {
      return 'I couldn’t open that picture in this browser. Try a JPG or PNG of the dec page. Your file was not uploaded.';
    }
    if (/load|network|worker|tesseract|fetch/i.test(m)) {
      return 'The reader didn’t load. You can still answer the eight questions, or text me the photo and I’ll read it myself. Your file was not uploaded.';
    }
    return 'I couldn’t read that file. Try the declarations page as a clearer photo, or answer the eight questions. Your file was not uploaded.';
  }

  function itemsToText(items) {
    var usable = [];
    items.forEach(function (it) {
      if (it && it.str && it.transform) usable.push(it);
    });
    if (!usable.length) {
      return items.map(function (it) { return it && it.str || ''; }).join(' ');
    }
    usable.sort(function (a, b) {
      var dy = b.transform[5] - a.transform[5];
      if (Math.abs(dy) > 3) return dy > 0 ? 1 : -1;
      return a.transform[4] - b.transform[4];
    });
    var lines = [];
    var cur = [];
    var lastY = null;
    var lastX = 0;
    var lastW = 0;
    usable.forEach(function (it) {
      var y = it.transform[5];
      var x = it.transform[4];
      var w = it.width || 0;
      if (lastY === null || Math.abs(y - lastY) > 3) {
        if (cur.length) lines.push(cur.join(''));
        cur = [it.str];
      } else {
        var gap = x - (lastX + lastW);
        cur.push((gap > 2 ? ' ' : '') + it.str);
      }
      if (it.hasEOL) {
        lines.push(cur.join(''));
        cur = [];
        lastY = null;
      } else {
        lastY = y;
      }
      lastX = x;
      lastW = w;
    });
    if (cur.length) lines.push(cur.join(''));
    return lines.join('\n');
  }

  function readPdf(data, mine) {
    return loadPdf().then(function () {
      if (mine !== job) return null;
      var task = window.pdfjsLib.getDocument({ data: data, isEvalSupported: false, verbosity: 0 });
      return task.promise.then(function (pdf) {
        var maxText = Math.min(pdf.numPages, 12);
        var chain = Promise.resolve([]);
        var pageNo;
        for (pageNo = 1; pageNo <= maxText; pageNo++) {
          (function (n) {
            chain = chain.then(function (acc) {
              if (mine !== job) return acc;
              return pdf.getPage(n).then(function (page) {
                return page.getTextContent().then(function (content) {
                  acc.push(itemsToText(content.items || []));
                  return acc;
                });
              });
            });
          })(pageNo);
        }
        return chain.then(function (parts) {
          var text = parts.join('\n\n').trim();
          var note = pdf.numPages > 12 ? 'I read the first 12 pages. ' : ('I read ' + maxText + (maxText === 1 ? ' page. ' : ' pages. '));
          if (text.length >= 200) {
            pdf.destroy();
            return { text: text, note: note };
          }
          var ocrPages = Math.min(pdf.numPages, 3);
          note = 'This looks like a scan. I read ' + ocrPages + (ocrPages === 1 ? ' page' : ' pages') + ' as an image, on this device. A blurry line can be misread. ';
          if (pdf.numPages > 3) note += 'I stopped after 3 pages. If the dec page is later, upload those pages on their own. ';
          var canvases = [];
          var seq = Promise.resolve();
          var p;
          for (p = 1; p <= ocrPages; p++) {
            (function (n) {
              seq = seq.then(function () {
                if (mine !== job) return null;
                showSteps(stepIndex, 'Reading scanned page ' + n + ' on this device…');
                return pdf.getPage(n).then(pageToCanvas);
              }).then(function (canvas) {
                if (canvas) canvases.push(canvas);
              });
            })(p);
          }
          return seq.then(function () {
            pdf.destroy();
            return ocrCanvases(canvases, mine).then(function (ocrText) {
              return { text: (text + '\n' + ocrText).trim(), note: note, ocr: true };
            });
          });
        });
      });
    });
  }

  function pageToCanvas(page) {
    var base = page.getViewport({ scale: 1 });
    var scale = Math.min(2, 1600 / base.width);
    var vp = page.getViewport({ scale: scale });
    var canvas = document.createElement('canvas');
    canvas.width = Math.ceil(vp.width);
    canvas.height = Math.ceil(vp.height);
    return page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise.then(function () {
      return canvas;
    });
  }

  function blobToCanvas(blob) {
    function draw(source, w, h) {
      var maxW = 1800;
      var scale = Math.min(1, maxW / w);
      var canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(w * scale));
      canvas.height = Math.max(1, Math.round(h * scale));
      var g = canvas.getContext('2d');
      g.fillStyle = '#fff';
      g.fillRect(0, 0, canvas.width, canvas.height);
      g.drawImage(source, 0, 0, canvas.width, canvas.height);
      return canvas;
    }
    if (window.createImageBitmap) {
      return createImageBitmap(blob).then(function (bmp) {
        var canvas = draw(bmp, bmp.width, bmp.height);
        if (bmp.close) bmp.close();
        return canvas;
      }).catch(function () { return imageElementCanvas(blob, draw); });
    }
    return imageElementCanvas(blob, draw);
  }

  function imageElementCanvas(blob, draw) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(draw(img, img.naturalWidth || img.width, img.naturalHeight || img.height));
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('image'));
      };
      img.src = url;
    });
  }

  function ensureWorker() {
    return loadTess().then(function () {
      if (ocrWorker) return ocrWorker;
      return window.Tesseract.createWorker('eng', 1, {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.1.1',
        langPath: 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng/4.0.0_best_int',
        logger: function (m) { ocrLog(m); }
      }).then(function (worker) {
        ocrWorker = worker;
        return worker;
      });
    });
  }

  function ocrCanvases(canvases, mine) {
    if (!canvases.length) return Promise.resolve('');
    ocrLog = function (m) {
      if (mine !== job) return;
      var status = m && m.status || '';
      var label = 'Reading the photo on this device…';
      if (/language|traineddata/i.test(status)) label = 'Loading the English reader. Your file stays here.';
      else if (/core|initializ/i.test(status)) label = 'Getting the reader ready on this device…';
      else if (/recogniz/i.test(status) && typeof m.progress === 'number') label = 'Reading the photo on this device… ' + Math.round(m.progress * 100) + '%';
      showSteps(stepIndex, label);
    };
    return ensureWorker().then(function (worker) {
      var seq = Promise.resolve('');
      canvases.forEach(function (canvas) {
        seq = seq.then(function (acc) {
          if (mine !== job) return acc;
          return worker.recognize(canvas).then(function (res) {
            var chunk = res && res.data && res.data.text || '';
            return (acc + '\n' + chunk).trim();
          });
        });
      });
      return seq;
    });
  }

  function heicToBlob(file) {
    var ready = window.heic2any ? Promise.resolve() : loadScript(HEIC_SRC);
    return ready.then(function () {
      if (!window.heic2any) throw new Error('heic');
      return window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
    }).then(function (out) {
      if (!out) throw new Error('heic');
      return Array.isArray(out) ? out[0] : out;
    }).catch(function () { throw new Error('heic'); });
  }

  function handleFile(file) {
    var mine = ++job;
    view = 'upload';
    document.getElementById('pc-file').value = '';
    document.getElementById('pc-cam').value = '';
    setError('');
    document.getElementById('pc-slip').hidden = true;
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError(humanize(new Error('size')));
      return;
    }
    var kind = kindOf(file);
    if (!kind) {
      setError(humanize(new Error('type')));
      return;
    }
    setBusy(true);
    var started = Date.now();
    var stopSteps = watchSteps(mine);
    document.getElementById('pc-status').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    var done;
    if (kind === 'pdf') {
      done = file.arrayBuffer().then(function (buf) {
        return readPdf(new Uint8Array(buf), mine);
      });
    } else if (kind === 'heic') {
      showSteps(stepIndex, 'Converting the HEIC photo on this device…');
      done = heicToBlob(file).then(function (blob) {
        return blobToCanvas(blob);
      }).then(function (canvas) {
        return ocrCanvases([canvas], mine).then(function (text) {
          return { text: text, note: 'I read this from a photo, on this device. A blurry line can be misread. ', ocr: true };
        });
      });
    } else {
      done = blobToCanvas(file).then(function (canvas) {
        return ocrCanvases([canvas], mine).then(function (text) {
          return { text: text, note: 'I read this from a photo, on this device. A blurry line can be misread. ', ocr: true };
        });
      });
    }
    done.then(function (parsed) {
      if (mine !== job || !parsed) return null;
      var wait = Math.max(0, 2000 - (Date.now() - started));
      return new Promise(function (resolve) {
        setTimeout(function () {
          stopSteps();
          resolve(parsed);
        }, wait);
      });
    }).then(function (parsed) {
      if (mine !== job || !parsed) return;
      lastText = parsed.text || '';
      var result = analyzeText(lastText, readRefine());
      result.pagesNote = parsed.note || '';
      document.getElementById('pc-status').innerHTML = '';
      setLive('Checkup ready.');
      render(result);
    }).catch(function (err) {
      if (mine !== job) return;
      stopSteps();
      document.getElementById('pc-status').innerHTML = '';
      setError(humanize(err));
    }).then(function () {
      if (mine === job) setBusy(false);
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function safeHref(h) {
    if (!h || h.charAt(0) !== '/') return '';
    return h;
  }

  function itemHtml(it) {
    var link = safeHref(it.href);
    return '<article class="pc-item">' +
      '<h3>' + esc(it.title) + '</h3>' +
      '<p class="pc-saw">' + esc(it.saw) + '</p>' +
      '<p>' + esc(it.why) + '</p>' +
      (it.lease ? '<p class="pc-lease">' + esc(it.lease) + '</p>' : '') +
      (link ? '<p class="pc-more"><a href="' + esc(link) + '">' + esc(it.linkLabel) + '</a></p>' : '') +
      '</article>';
  }

  function sectionHtml(id, title, items, empty) {
    if (!items.length && !empty) return '';
    var body = items.length ? items.map(itemHtml).join('') : '<p>' + esc(empty) + '</p>';
    return '<section id="' + id + '"><h2>' + esc(title) + '</h2>' + body + '</section>';
  }

  function render(result, opts) {
    opts = opts || {};
    lastResult = result;
    var slip = document.getElementById('pc-slip');
    var out = document.getElementById('pc-out');
    var refine = document.getElementById('pc-refine');
    var title = result.mode === 'questions' ? 'What I’d ask about, for your place' : (result.confidence === 'low' ? 'I couldn’t read that well enough' : 'What I could read');
    var intro;
    if (result.mode === 'questions') {
      intro = 'You didn’t upload a policy, so nothing here was found on a form. This is the list I’d bring to lunch for a place like yours, so you keep more of what you’ve built.';
      if (result.facts) intro += ' You said: ' + result.facts + '.';
    } else if (result.confidence === 'low') {
      intro = 'I couldn’t read enough of that file to trust a list. That’s on the picture, not on your policy. Try the declarations page on its own, in better light, or answer the eight questions. You can also text me the photo and I’ll read it myself.';
    } else if (result.confidence === 'medium') {
      intro = 'I could read some of this and not all of it. What looks solid can stay put. Where I didn’t see a line, it may be on a page the photo cut off. The point is to keep more of what you’ve built, not to hand you a grade.';
    } else {
      intro = 'Here’s what I could read. What looks solid can stay put. The rest are questions I’d ask, so you keep more of what you’ve built. Not seeing a line is not a verdict. A dec page leaves things off.';
    }
    var html = '<p class="ticket">Your list · not a grade</p>';
    html += '<h2 id="pc-result-title" tabindex="-1">' + esc(title) + '</h2>';
    html += '<p class="pc-intro">' + esc(intro) + '</p>';
    if (result.pagesNote) html += '<p class="pc-note">' + esc(result.pagesNote) + '</p>';
    if (result.inferredPour && result.mode === 'questions') {
      html += '<p class="pc-note">I treated a bar or brewery as a place that pours. If that’s wrong, change the alcohol answer.</p>';
    }
    if (!(result.mode === 'upload' && result.confidence === 'low')) {
      html += '<div class="pc-renew" id="pc-renew"><h2>' + esc(result.renewal.title) + '</h2><p>' + esc(result.renewal.body) + '</p></div>';
      if (result.mode === 'upload') {
        var carrierLine = result.carrier
          ? 'The carrier name I could read was ' + result.carrier + '. If the logo says otherwise, trust the logo.'
          : (result.confidence === 'high' ? 'I couldn’t tell the carrier from these pages.' : '');
        if (carrierLine) html += '<p id="pc-carrier">' + esc(carrierLine) + '</p>';
      }
      html += sectionHtml('pc-solid', result.mode === 'questions' ? 'What I’d start with' : 'What looks solid', result.solid,
        result.mode === 'upload' && !result.solid.length ? 'I didn’t find a line I’d call solid. That can mean the photo missed the dec page, or the wording is different from what I look for. It does not mean the policy is empty.' : '');
      html += sectionHtml('pc-ask', 'Worth asking your agent about', result.ask, '');
      if (result.optional.length) {
        html += '<h2 class="pc-sub">Usually optional, still fair to ask</h2>';
        html += result.optional.map(itemHtml).join('');
      }
      if (result.quiet.length) {
        html += '<div class="pc-quiet">' + result.quiet.map(function (it) {
          return '<p>' + esc(it.saw) + '</p>';
        }).join('') + '</div>';
      }
      html += premiumHtml(result);
      html += '<p class="pc-next">If you already have an agent, ask them. If you want me to look, text me the list. If it all looks fine, I’ll say so.</p>';
    } else {
      html += '<p class="pc-next"><a href="#pc-questions">Answer the eight questions</a> instead, or text me the photo from the bottom of the page.</p>';
      html += premiumHtml(result);
    }
    html += '<p class="pc-fine">This is general information from Sam Johnson at Shaw, Moses, Mendenhall &amp; Associates Insurance, not advice. I can miss a coverage that sits on a form I didn’t see, and I can misread a line. Coverage depends on the policy that was actually issued. Nothing here is a quote, a promise of a price, or a guarantee. CA License #4536079.</p>';
    if (result.mode === 'upload' && lastText) {
      var raw = lastText.length > 12000 ? lastText.slice(0, 12000) + '\n\n[Stopped the preview here. The read used the rest too, still on this device.]' : lastText;
      html += '<details class="pc-rawwrap"><summary>Show the text I read</summary><pre class="pc-raw">' + esc(raw) + '</pre></details>';
    }
    html += '<p><button type="button" class="pc-textbtn" id="pc-reset">Start over</button></p>';
    out.innerHTML = html;
    refine.hidden = !(result.mode === 'upload' && result.confidence !== 'low');
    slip.hidden = false;
    updateOutbound(result);
    if (!opts.quiet) {
      var h = document.getElementById('pc-result-title');
      if (h) h.focus({ preventScroll: true });
      slip.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function premiumHtml(result) {
    var lead = result.premium ? '<p>You said the premium moved. Here’s the context I give people before we open the dec page. It is not a verdict on your bill.</p>' : '';
    return '<section class="pc-premium" id="pc-premium"><h2>Why did my premium go up?</h2>' + lead +
      '<p>Sometimes it didn’t, and the letter was just loud. A national broker survey for April through June 2026 showed commercial property premiums down about 6.3% on average, and workers’ comp down nationally. California is not that average. The state’s advisory benchmark for workers’ comp losses went up 6.6% for policies starting September 1, 2026, and the restaurant classes sit higher than the statewide number. Umbrella and commercial auto have been the lines still climbing. A café on a flat block and a place against the brush are not the same risk.</p>' +
      '<p>I am not going to tell you your bill should have moved by any particular percent. <a href="/blog/california-restaurant-insurance-market.html">The longer version, with the sources, is the market note</a>.</p></section>';
  }

  function updateOutbound(result) {
    var body = smsBody(result);
    var href = SMS_BASE + encodeURIComponent(body);
    var sms = document.getElementById('pc-sms');
    var stick = document.getElementById('pc-stick');
    var mail = document.getElementById('pc-mail');
    if (sms) {
      sms.href = href;
      sms.textContent = result ? 'Text Sam your results' : 'Text Sam';
    }
    if (stick) stick.href = href;
    if (mail) {
      var text = result ? shareText(result) : 'I used Sam Johnson’s restaurant policy checkup.';
      mail.href = 'mailto:?subject=' + encodeURIComponent('Restaurant policy checkup') + '&body=' + encodeURIComponent(text);
    }
  }

  function onShare() {
    var text = lastResult ? shareText(lastResult) : 'I used Sam Johnson’s restaurant policy checkup. General information, not advice.';
    if (navigator.share) {
      navigator.share({ title: 'Restaurant policy checkup', text: text }).catch(function (err) {
        if (err && err.name === 'AbortError') return;
        window.location.href = document.getElementById('pc-mail').href;
      });
    } else {
      window.location.href = document.getElementById('pc-mail').href;
    }
  }

  function resetAll() {
    job += 1;
    view = 'none';
    lastResult = null;
    lastText = '';
    document.getElementById('pc-slip').hidden = true;
    document.getElementById('pc-out').innerHTML = '';
    document.getElementById('pc-refine').hidden = true;
    document.getElementById('pc-status').innerHTML = '';
    stepIndex = -1;
    statusExtra = '';
    setError('');
    setLive('');
    setBusy(false);
    updateOutbound(null);
    var boxes = document.querySelectorAll('#pc-qform input, #pc-refine input');
    Array.prototype.forEach.call(boxes, function (b) { b.checked = false; });
    setCount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
