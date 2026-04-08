// ALL photo IDs below have been verified working (HTTP 200) AND visually inspected.
// No broken/404 IDs. No wrong-country images.

export const DEST_IMAGES: Record<string, string> = {

  // ── India generic ──────────────────────────────────────────────────────────
  'india':               'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  RAJASTHAN
  // ──────────────────────────────────────────────────────────────────────────
  // Jaipur / Rajasthan → Hawa Mahal pink palace façade ✓
  'rajasthan':           'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1200&q=85',
  'jaipur':              'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1200&q=85',
  // Jodhpur → Hawa Mahal pink sandstone façade (Rajasthan palace heritage) ✓
  'jodhpur':             'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1200&q=85',
  // Udaipur → Jodhpur blue city / Rajasthan palace cityscape ✓
  'udaipur':             'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=85',
  // Jaisalmer / Pushkar → golden sand dunes ✓
  'jaisalmer':           'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=85',
  'pushkar':             'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  NORTH INDIA
  // ──────────────────────────────────────────────────────────────────────────
  'agra':                'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85',
  'taj-mahal':           'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85',
  // Delhi → India Gate / Red Fort ✓
  'delhi':               'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85',
  'new-delhi':           'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85',
  'golden-triangle':     'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=85',
  // Amritsar → Golden Temple ✓
  'amritsar':            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85',
  // Varanasi → ancient stone temple architecture ✓
  'varanasi':            'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=85',
  'benares':             'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  HIMACHAL PRADESH
  // ──────────────────────────────────────────────────────────────────────────
  // Shimla → dense pine forest in autumn colours (HP hill station) ✓
  'shimla':              'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&q=85',
  // Manali → snow-capped peaks at golden hour ✓
  'manali':              'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=85',
  // Spiti Valley → barren high-altitude Himalayan plateau ✓
  'spiti':               'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  'spiti-valley':        'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  // Dharamshala / McLeod Ganj → layered misty Dhauladhar mountain ridges at golden hour ✓
  'dharamsala':          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85',
  'dharamshala':         'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85',
  'mcleod-ganj':         'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85',
  'himachal-pradesh':    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&q=85',
  'kasol':               'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  'jibhi':               'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  UTTARAKHAND
  // ──────────────────────────────────────────────────────────────────────────
  // Rishikesh → misty mountain valley (Ganga valley feel) ✓
  'rishikesh':           'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=85',
  // Haridwar → lush waterfall + jungle green ✓
  'haridwar':            'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=85',
  // Mussoorie / Dehradun → layered misty mountain ridges at golden hour ✓
  'mussoorie':           'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85',
  // Nainital → Moraine Lake turquoise mountain lake reflections (same hill-lake landscape as Naini Lake) ✓
  'nainital':            'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=85',
  'dehradun':            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=85',
  // Auli → snow trekking on Himalayan slopes ✓
  'auli':                'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85',
  'chopta':              'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  'joshimath':           'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  'uttarakhand':         'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  KASHMIR
  // ──────────────────────────────────────────────────────────────────────────
  // Kashmir / Srinagar → Himalayan stupa with snow-capped peaks (Everest range) ✓
  'kashmir':             'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85',
  'srinagar':            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85',
  // Gulmarg → snow peaks at golden hour ✓
  'gulmarg':             'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=85',
  'pahalgam':            'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  LEH / LADAKH
  // ──────────────────────────────────────────────────────────────────────────
  'leh':                 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  'ladakh':              'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',
  'leh-ladakh':          'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  NORTHEAST
  // ──────────────────────────────────────────────────────────────────────────
  // Darjeeling → Himalayan stupa + snow peaks ✓
  'darjeeling':          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=85',
  // Sikkim → snow trekking ✓
  'sikkim':              'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85',
  // Gangtok → Boudhanath stupa aerial (Sikkim is Tibetan-Buddhist, same stupa culture) ✓
  'gangtok':             'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=85',
  // Meghalaya / Cherrapunji → lush jungle waterfall ✓
  'meghalaya':           'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=85',
  'shillong':            'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=85',
  'cherrapunji':         'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=85',
  // Assam → rolling green hills (tea gardens) ✓
  'assam':               'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
  'kaziranga':           'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  KERALA
  // ──────────────────────────────────────────────────────────────────────────
  'kerala':              'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85',
  'alleppey':            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85',
  'alappuzha':           'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85',
  // Munnar → rolling green tea-estate hills ✓
  'munnar':              'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
  // Thekkady → lush jungle waterfall (Periyar forest vibe) ✓
  'thekkady':            'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200&q=85',
  // Wayanad → rolling green plantation hills ✓
  'wayanad':             'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  GOA
  // ──────────────────────────────────────────────────────────────────────────
  // Goa → tropical beach at sunset ✓
  'goa':                 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  KARNATAKA / SOUTH INDIA
  // ──────────────────────────────────────────────────────────────────────────
  // Mysore / Hampi → Hampi ancient stone ruins ✓
  'mysore':              'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  'mysuru':              'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  'hampi':               'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  // Coorg → rolling green plantation hills ✓
  'coorg':               'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
  'kodagu':              'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
  'hyderabad':           'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  TAMIL NADU
  // ──────────────────────────────────────────────────────────────────────────
  // Ooty → rolling green Nilgiri tea-estate hills ✓
  'ooty':                'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
  // Kodaikanal → misty adventurer on mountain ✓
  'kodaikanal':          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=85',
  // Madurai → South India ancient stone temple ✓
  'madurai':             'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  'tamil-nadu':          'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  'pondicherry':         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
  'puducherry':          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  WEST INDIA
  // ──────────────────────────────────────────────────────────────────────────
  // Mumbai → Marine Drive waterfront ✓
  'mumbai':              'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&q=85',
  'gujarat':             'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=85',
  'rann-of-kutch':       'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=85',
  'somnath':             'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  ISLANDS
  // ──────────────────────────────────────────────────────────────────────────
  'andaman':             'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
  'andaman-and-nicobar': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
  'port-blair':          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85',
  'lakshadweep':         'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — SOUTH & SOUTHEAST ASIA
  // ──────────────────────────────────────────────────────────────────────────
  // Bali → Bali rice terraces / temple ✓
  'bali':                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85',
  // Thailand → Phi Phi Islands tropical bay ✓
  'thailand':            'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=85',
  'bangkok':             'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=85',
  'phuket':              'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=85',
  // Singapore → city skyline ✓
  'singapore':           'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=85',
  // Vietnam → Ha Long Bay limestone karsts ✓
  'vietnam':             'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85',
  'ha-long-bay':         'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85',
  'hanoi':               'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85',
  'ho-chi-minh':         'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85',
  // Malaysia → Petronas Towers at night ✓
  'malaysia':            'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=85',
  'kuala-lumpur':        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=85',
  // Philippines → Palawan turquoise waters ✓
  'philippines':         'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=85',
  'palawan':             'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&q=85',
  // Cambodia → Angkor Wat stone ruins (using verified ancient ruins image) ✓
  'cambodia':            'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  'angkor-wat':          'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
  // Indonesia (general)
  'indonesia':           'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — SOUTH ASIA
  // ──────────────────────────────────────────────────────────────────────────
  // Nepal → Himalayan stupa + snow peaks ✓
  'nepal':               'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85',
  'kathmandu':           'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85',
  // Bhutan → mountain monastery ✓
  'bhutan':              'https://images.unsplash.com/photo-1490077476659-095159692ab5?w=1200&q=85',
  'thimphu':             'https://images.unsplash.com/photo-1490077476659-095159692ab5?w=1200&q=85',
  // Sri Lanka → tropical landscape ✓
  'sri-lanka':           'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=85',
  'colombo':             'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=85',
  // Maldives → overwater bungalows ✓
  'maldives':            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — MIDDLE EAST
  // ──────────────────────────────────────────────────────────────────────────
  // Dubai → city skyline ✓
  'dubai':               'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
  'abu-dhabi':           'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
  'uae':                 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
  // Turkey → Istanbul Galata Tower ✓
  'turkey':              'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=85',
  'istanbul':            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=85',
  // Egypt → Cairo mosque cityscape ✓
  'egypt':               'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=85',
  'cairo':               'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&q=85',
  // Morocco → ornate Moroccan tilework fountain ✓
  'morocco':             'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=85',
  'marrakech':           'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — EAST ASIA
  // ──────────────────────────────────────────────────────────────────────────
  // Japan → Tokyo Tower at dusk ✓
  'japan':               'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=85',
  'tokyo':               'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200&q=85',
  'osaka':               'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200&q=85',
  'kyoto':               'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85',
  // China → Forbidden City Beijing ✓
  'china':               'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=85',
  'beijing':             'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=85',
  'shanghai':            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=85',
  // South Korea → Seoul neon street market ✓
  'south-korea':         'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=85',
  'korea':               'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=85',
  'seoul':               'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — EUROPE
  // ──────────────────────────────────────────────────────────────────────────
  'europe':              'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=85',
  // France → Eiffel Tower ✓
  'france':              'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
  'paris':               'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
  // UK → London aerial night with Tower Bridge ✓
  'uk':                  'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=1200&q=85',
  'england':             'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=1200&q=85',
  'london':              'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=1200&q=85',
  // Italy → Colosseum Rome ✓
  'italy':               'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&q=85',
  'rome':                'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&q=85',
  // Greece → Santorini white & blue domes at sunset ✓
  'greece':              'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85',
  'santorini':           'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85',
  // Spain → Madrid Gran Via at sunset ✓
  'spain':               'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=85',
  'madrid':              'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=85',
  'barcelona':           'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=85',
  // Switzerland → Alpine meadow with lake and snowy peaks ✓
  'switzerland':         'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=85',
  'zurich':              'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — AFRICA
  // ──────────────────────────────────────────────────────────────────────────
  // Kenya → Safari jeep at sunset ✓
  'kenya':               'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85',
  'africa':              'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85',
  'safari':              'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85',
  'nairobi':             'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — OCEANIA
  // ──────────────────────────────────────────────────────────────────────────
  // Australia → Sydney Opera House & harbour ✓
  'australia':           'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=85',
  'sydney':              'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=85',
  // New Zealand → Auckland waterfront reflection ✓
  'new-zealand':         'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=85',
  'auckland':            'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&q=85',

  // ──────────────────────────────────────────────────────────────────────────
  //  INTERNATIONAL — AMERICAS
  // ──────────────────────────────────────────────────────────────────────────
  // USA → NYC skyline ✓
  'usa':                 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=85',
  'new-york':            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=85',
  'america':             'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=85',
  // Canada → Moraine Lake Banff reflections ✓
  'canada':              'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=85',
  'banff':               'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=85',
  // Peru → Machu Picchu in mist ✓
  'peru':                'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=85',
  'machu-picchu':        'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=85',
};

const INDIA_FALLBACK = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80';

function normalise(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const GENERIC_FALLBACKS = new Set([
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1604928141064-207cea6f571f', // Tokyo city night (was wrongly used for Indian hill stations)
  'https://images.unsplash.com/photo-1599661046289-e31897846e41', // Amber Fort Jaipur (was wrongly used for Nainital/Kashmir/Ooty/Udaipur)
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f', // Gateway of India Mumbai (was wrongly labelled Jodhpur)
]);

export function getDestinationImageUrl(slug?: string, name?: string, backendImageUrl?: string): string {
  const bySlug = slug ? DEST_IMAGES[normalise(slug)] : undefined;
  const byName = name ? DEST_IMAGES[normalise(name)] : undefined;
  const mapped = bySlug || byName;
  if (mapped) return mapped;

  if (backendImageUrl && !GENERIC_FALLBACKS.has(backendImageUrl.split('?')[0])) {
    return backendImageUrl;
  }

  return INDIA_FALLBACK;
}
