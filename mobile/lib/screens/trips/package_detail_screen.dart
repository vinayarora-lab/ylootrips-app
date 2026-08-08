import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../providers/currency_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../widgets/booking_payment_sheet.dart';

// ── Per-package itinerary data keyed by slug ─────────────────────────────────
const _itineraries = <String, List<Map<String, String>>>{
  'kashmir-tour-package': [
    {'day': 'Day 1', 'title': 'Arrival in Srinagar', 'desc': 'Arrive at Srinagar airport. Check-in to premium houseboat on Dal Lake. Evening Shikara ride watching the sunset on the glassy lake.'},
    {'day': 'Day 2', 'title': 'Gulmarg Snow Adventure', 'desc': 'Drive to Gulmarg (2,650m). Ride the highest cable car in Asia — Gulmarg Gondola. Snow activities, skiing and stunning Himalayan panoramas.'},
    {'day': 'Day 3', 'title': 'Pahalgam Valley', 'desc': 'Drive to Pahalgam "Valley of Shepherds". Trek to Betaab Valley and Aru Valley. Evening at leisure on the Lidder riverside.'},
    {'day': 'Day 4', 'title': 'Srinagar Mughal Gardens', 'desc': 'Visit Nishat Bagh, Shalimar Bagh, and Chashme Shahi gardens — built by Mughal emperors. Afternoon at floating vegetable market.'},
    {'day': 'Day 5', 'title': 'Old Srinagar & Shopping', 'desc': 'Visit Shankaracharya temple. Explore local bazaars for Pashmina shawls, Kashmiri carpets, and saffron.'},
    {'day': 'Day 6', 'title': 'Sonamarg Day Trip', 'desc': 'Full day excursion to Sonamarg "Meadow of Gold" (2,730m). Pony rides to Thajiwas glacier. Return to houseboat.'},
    {'day': 'Day 7', 'title': 'Departure', 'desc': 'Morning breakfast on the houseboat with lake views. Transfer to Srinagar airport for departure. Take home memories of paradise.'},
  ],
  'bali-honeymoon-package': [
    {'day': 'Day 1', 'title': 'Romantic Arrival in Bali', 'desc': 'Arrive at Ngurah Rai Airport. Transfer to private pool villa in Ubud. Welcome dinner with candle-light terrace setting.'},
    {'day': 'Day 2', 'title': 'Ubud Cultural Immersion', 'desc': 'Morning yoga session. Visit Tegallalang Rice Terraces for iconic shots. Tanah Lot temple at sunset. Balinese cooking class.'},
    {'day': 'Day 3', 'title': 'Waterfalls & Temples', 'desc': 'Visit Tirta Gangga water palace and Lempuyang "Gate of Heaven". Tegenungan Waterfall swim. Sunset at Uluwatu cliff temple.'},
    {'day': 'Day 4', 'title': 'Seminyak Beach Day', 'desc': 'Lazy morning at Seminyak Beach. Couples spa treatment. Sunset cocktails at Potato Head Beach Club. Fine dining at Ku De Ta.'},
    {'day': 'Day 5', 'title': 'Island Hopping', 'desc': 'Speedboat to Nusa Penida. Visit Kelingking Beach viewpoint, Angel Billabong, and Broken Beach. Snorkelling with Manta rays.'},
    {'day': 'Day 6', 'title': 'Mount Batur Sunrise', 'desc': 'Pre-dawn trek to summit of Mount Batur (1,717m). Watch sunrise over the volcano and Batur Lake. Afternoon Balinese massage.'},
    {'day': 'Day 7', 'title': 'Departure', 'desc': 'Leisurely morning. Last dip in private villa pool. Transfer to airport with lifelong memories of paradise.'},
  ],
  'kerala-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive in Kochi', 'desc': 'Arrive at Kochi airport. Fort Kochi heritage walk — Chinese fishing nets, St. Francis Church, Jewish Synagogue. Kathakali dance performance.'},
    {'day': 'Day 2', 'title': 'Munnar Tea Estates', 'desc': 'Drive to Munnar through Western Ghats. Visit TATA Tea Museum. Walk through emerald tea gardens. Watch tea processing. Night at hill-top resort.'},
    {'day': 'Day 3', 'title': 'Munnar Wildlife', 'desc': 'Early morning jeep safari in Eravikulam National Park (Nilgiri Tahr). Visit Attukad Waterfalls and Echo Point. Sunset from Top Station.'},
    {'day': 'Day 4', 'title': 'Thekkady Spice Garden', 'desc': 'Drive to Thekkady. Periyar Wildlife Sanctuary boat ride. Spice plantation walk — cardamom, pepper, cinnamon. Bamboo rafting on Periyar lake.'},
    {'day': 'Day 5', 'title': 'Alleppey Houseboat', 'desc': 'Drive to Alleppey. Board your luxury A/C houseboat. Cruise serene backwaters, watching village life on the banks. Sunset on the water.'},
    {'day': 'Day 6', 'title': 'Backwaters & Varkala', 'desc': 'Morning on houseboat. Transfer to Varkala cliffside beach. Beach shacks, Ayurvedic massage. Watch fishermen at sunset.'},
    {'day': 'Day 7', 'title': 'Kovalam Beach', 'desc': 'Drive to Kovalam — Kerala\'s most famous lighthouse beach. Ayurvedic full-body massage. Evening seafood dinner.'},
    {'day': 'Day 8', 'title': 'Departure from Trivandrum', 'desc': 'Morning visit to Padmanabhaswamy Temple. Transfer to Trivandrum airport for departure. Kerala will call you back.'},
  ],
  'dubai-tour-package-from-delhi': [
    {'day': 'Day 1', 'title': 'Welcome to Dubai', 'desc': 'Arrive at Dubai International Airport. Transfer to luxury hotel. Evening Dubai Marina Walk — dinner at waterfront restaurant. Night cruise optional.'},
    {'day': 'Day 2', 'title': 'Iconic Dubai', 'desc': 'Visit Burj Khalifa (At the Top, 124th floor). Dubai Mall — world\'s largest shopping centre. Dubai Fountain show at sunset. Gold Souk and Spice Souk.'},
    {'day': 'Day 3', 'title': 'Desert Safari', 'desc': 'Morning at leisure. Afternoon desert safari — dune bashing, camel ride, sandboarding. Bedouin camp with BBQ dinner, belly dancing and Tanoura show.'},
    {'day': 'Day 4', 'title': 'Old Dubai & Abra Ride', 'desc': 'Al Fahidi Historical Neighbourhood. Abra (wooden boat) across the Creek. Bastakiya Art galleries. Jumeirah Mosque. Afternoon at Jumeirah Beach.'},
    {'day': 'Day 5', 'title': 'Palm Jumeirah & Atlantis', 'desc': 'The Palm Jumeirah monorail. Atlantis Aquaventure Waterpark. Visit Burj Al Arab exterior. Evening at JBR (Jumeirah Beach Residence) walk.'},
    {'day': 'Day 6', 'title': 'Shopping & Departure', 'desc': 'Morning Dubai Frame for panoramic views. Last minute shopping at Dubai Mall or Gold Souk. Transfer to airport for departure.'},
  ],
  'maldives-luxury-package': [
    {'day': 'Day 1', 'title': 'Welcome to Maldives Paradise', 'desc': 'Arrive at Malé. Speedboat transfer to private island resort. Check-in to overwater bungalow. Sunset welcome drink on your private deck.'},
    {'day': 'Day 2', 'title': 'Snorkelling & Reef Exploration', 'desc': 'House reef snorkelling morning — turtles, rays, and colourful fish. Afternoon Manta Ray excursion. Evening bioluminescent beach walk.'},
    {'day': 'Day 3', 'title': 'Spa & Dolphin Cruise', 'desc': 'Full morning Ayurvedic spa treatment over the lagoon. Afternoon dolphin watching cruise. Sunset sky bar with Champagne.'},
    {'day': 'Day 4', 'title': 'Deep Sea Fishing & Diving', 'desc': 'Early morning traditional Maldivian fishing. Afternoon scuba diving lesson or certified dive (crystal visibility). Freshly caught tuna BBQ.'},
    {'day': 'Day 5', 'title': 'Uninhabited Island Picnic', 'desc': 'Private speedboat to uninhabited sandbank. Gourmet picnic basket. Kayaking, paddleboarding. Return for sunset cocktails.'},
    {'day': 'Day 6', 'title': 'Departure', 'desc': 'Final breakfast floating on the lagoon. Last snorkel. Speedboat transfer to Malé for departure. Paradise stays in your heart forever.'},
  ],
  'goa-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive in Goa', 'desc': 'Land in Goa. Transfer to beachside hotel. Check-in and freshen up. Evening stroll at Calangute Beach. Welcome dinner with Goan fish curry and feni.'},
    {'day': 'Day 2', 'title': 'North Goa Beaches', 'desc': 'Baga, Anjuna and Vagator beaches. Water sports — parasailing, jet ski, banana boat. Anjuna Flea Market if Wednesday. Sundowner at Tito\'s.'},
    {'day': 'Day 3', 'title': 'Old Goa Heritage', 'desc': 'Visit Basilica of Bom Jesus (UNESCO site). Se Cathedral. Archaeological Museum. Fontainhas Latin Quarter. Panaji walking tour.'},
    {'day': 'Day 4', 'title': 'South Goa Serenity', 'desc': 'Drive to South Goa — Colva, Benaulim, Palolem. Clean, quiet beaches. Butterfly Beach boat trip. Dudhsagar Waterfalls (seasonal).'},
    {'day': 'Day 5', 'title': 'Departure', 'desc': 'Morning at leisure on the beach. Last Goan breakfast — Bebinca and poi bread. Transfer to Goa airport for departure.'},
  ],
  'golden-triangle-10-day': [
    {'day': 'Day 1', 'title': 'Arrive Delhi', 'desc': 'Arrive in Delhi. Transfer to hotel. Rest and freshen up. Evening Delhi food walk — Karim\'s in Jama Masjid area, Chandni Chowk parathas.'},
    {'day': 'Day 2', 'title': 'Old & New Delhi', 'desc': 'Red Fort, Jama Masjid, Chandni Chowk by rickshaw. Afternoon: India Gate, Parliament, Rashtrapati Bhavan. Qutub Minar at golden hour.'},
    {'day': 'Day 3', 'title': 'Delhi to Agra', 'desc': 'Morning drive to Agra (3 hrs). Agra Fort exploration. Evening visit to Taj Mahal at sunset — the marble palace glows amber.'},
    {'day': 'Day 4', 'title': 'Taj Mahal Sunrise', 'desc': 'Pre-dawn taxi to Eastern Gate for the magical sunrise at Taj Mahal. Mehtab Bagh (moonlight garden) opposite view. Afternoon Fatehpur Sikri.'},
    {'day': 'Day 5', 'title': 'Agra to Jaipur', 'desc': 'Drive Agra to Jaipur via Fatehpur Sikri. Stop at Abhaneri stepwell (Chand Baori). Check in at heritage haveli in Jaipur.'},
    {'day': 'Day 6', 'title': 'Amber Fort', 'desc': 'Morning elephant ride (or jeep) up to Amber Fort. Explore the Sheesh Mahal (Hall of Mirrors). Jal Mahal — palace in the lake.'},
    {'day': 'Day 7', 'title': 'Pink City Jaipur', 'desc': 'Hawa Mahal (Palace of Winds). City Palace museum. Jantar Mantar astronomical observatory. Johari Bazaar for gems and jewellery.'},
    {'day': 'Day 8', 'title': 'Pushkar Day Trip', 'desc': 'Drive to Pushkar (sacred lake city). Brahma Temple. Sunset ceremony at the ghats. Camel rides on the dunes outside town.'},
    {'day': 'Day 9', 'title': 'Ranthambore Wildlife', 'desc': 'Drive to Ranthambore National Park. Afternoon game drive — home to Bengal tigers, leopards and crocodiles. Night at jungle lodge.'},
    {'day': 'Day 10', 'title': 'Delhi Departure', 'desc': 'Morning drive back to Delhi. Optional last-minute shopping at Connaught Place. Transfer to airport for departure.'},
  ],
  'kerala-south-india-14-day': [
    {'day': 'Day 1-2', 'title': 'Arrive Kochi', 'desc': 'Arrive Kochi. Fort Kochi heritage walk. Chinese fishing nets. Kathakali performance. Day 2: Overnight houseboat booking.'},
    {'day': 'Day 3-4', 'title': 'Munnar', 'desc': 'Drive to Munnar. Tea museum and estate walk. Wildlife safari. Eravikulam National Park for Nilgiri Tahr.'},
    {'day': 'Day 5-6', 'title': 'Thekkady & Periyar', 'desc': 'Periyar Wildlife Sanctuary boat ride. Spice plantation. Bamboo rafting. Traditional Kerala martial arts (Kalaripayattu) demo.'},
    {'day': 'Day 7-8', 'title': 'Alleppey Backwaters', 'desc': 'Luxury houseboat cruise on Kerala backwaters. Village life, coconut palms, toddy shops. Overnight on water.'},
    {'day': 'Day 9-10', 'title': 'Varkala & Kovalam', 'desc': 'Cliff beach at Varkala. Ayurvedic spa. Kovalam lighthouse beach. Seafood by the sea.'},
    {'day': 'Day 11-12', 'title': 'Madurai & Meenakshi Temple', 'desc': 'Drive to Madurai. Meenakshi Amman Temple (4 towers, thousands of sculptures). Evening Aarti ceremony.'},
    {'day': 'Day 13', 'title': 'Pondicherry', 'desc': 'Drive to French Quarter Pondicherry. White Town boulevards. Sri Aurobindo Ashram. Promenade Beach. French bakeries.'},
    {'day': 'Day 14', 'title': 'Departure from Chennai', 'desc': 'Drive to Chennai. Marina Beach — second longest beach in the world. Transfer to Chennai airport for departure.'},
  ],
  'rajasthan-heritage-7-day': [
    {'day': 'Day 1', 'title': 'Arrive Jaipur — Pink City', 'desc': 'Arrive Jaipur. Check in to palace hotel. Evening food walk in Johari Bazaar. Rajasthani thali dinner with folk music.'},
    {'day': 'Day 2', 'title': 'Jaipur Highlights', 'desc': 'Amber Fort by elephant. City Palace. Hawa Mahal. Jantar Mantar. Gem and jewellery shopping in old bazaars.'},
    {'day': 'Day 3', 'title': 'Jaipur to Jodhpur', 'desc': 'Drive to Jodhpur "Blue City" (5 hrs). En-route Ajmer Dargah optional. Mehrangarh Fort overlooking the blue-painted city.'},
    {'day': 'Day 4', 'title': 'Jodhpur Desert', 'desc': 'Umaid Bhawan Palace visit. Stepwells of Toorji Ka Jhalra. Afternoon desert jeep safari and village visit near Osian dunes.'},
    {'day': 'Day 5', 'title': 'Jodhpur to Udaipur', 'desc': 'Scenic drive to Udaipur "City of Lakes". Ranakpur Jain temples en route (incredible 1,444 marble columns).'},
    {'day': 'Day 6', 'title': 'Udaipur — City of Lakes', 'desc': 'Lake Pichola boat ride to Jag Mandir. City Palace museum. Saheliyon Ki Bari. Sunset at Doodh Talai hills.'},
    {'day': 'Day 7', 'title': 'Departure', 'desc': 'Morning at Fateh Sagar Lake. Local market. Transfer to Udaipur airport for departure. Royal Rajasthan captured in your heart.'},
  ],
  'manali-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive Manali', 'desc': 'Fly to Bhuntar, drive to Manali. Old Manali stroll — cafes, apple orchards. Evening at Manu Temple. Bonfire and Himachali cuisine.'},
    {'day': 'Day 2', 'title': 'Solang Valley', 'desc': 'Solang Valley — Skiing, snowboarding, zorbing, paragliding, ATV rides. Cable car to top. Magnificent mountain panorama.'},
    {'day': 'Day 3', 'title': 'Rohtang Pass', 'desc': 'Drive to Rohtang Pass (3,978m). Snow activities, sledging. Views of Lahaul and Spiti valleys. Beas Kund trek if clear.'},
    {'day': 'Day 4', 'title': 'River Rafting & Kasol', 'desc': 'White-water rafting on River Beas (Grade III-IV). Drive to Kasol — Parvati Valley. Kheerganga trek optional.'},
    {'day': 'Day 5', 'title': 'Departure', 'desc': 'Morning at leisure. Hadimba Temple visit. Tibetan Monastery. Drive to Bhuntar airport or Chandigarh/Delhi.'},
  ],
  'andaman-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive Port Blair', 'desc': 'Arrive Port Blair. Cellular Jail (Light and Sound show). Corbyn\'s Cove Beach. Seafood dinner at Aberdeen Bazaar.'},
    {'day': 'Day 2', 'title': 'Ferry to Havelock Island', 'desc': 'Morning ferry to Havelock. Check in at resort. Afternoon at Radhanagar Beach (Asia\'s best beach). Spectacular sunset.'},
    {'day': 'Day 3', 'title': 'Scuba Diving & Snorkelling', 'desc': 'Certified scuba diving at Elephant Beach (coral gardens, sea turtles, vibrant reef fish). Glass-bottom boat ride.'},
    {'day': 'Day 4', 'title': 'Neil Island', 'desc': 'Ferry to Neil Island. Bharatpur Beach water sports. Natural Bridge (rock formation). Laxmanpur Beach for sunset.'},
    {'day': 'Day 5', 'title': 'Baratang & Mud Volcano', 'desc': 'Return to Port Blair. Drive through Jarawa Reserve to Baratang — Limestone Caves and Mud Volcanoes (unique in India).'},
    {'day': 'Day 6', 'title': 'Departure', 'desc': 'Morning at Wandoor Beach — pristine mangroves. Shopping for pearls and shells. Transfer to Port Blair airport.'},
  ],
  'ladakh-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive Leh — Acclimatise', 'desc': 'Fly to Leh (3,500m). REST — acclimatisation is crucial. Short walk to Leh Palace. Easy evening stroll in Leh market.'},
    {'day': 'Day 2', 'title': 'Leh Monasteries', 'desc': 'Hemis Monastery (largest in Ladakh). Thiksey Monastery (like a mini Potala Palace). Shey Palace. Easy day due to altitude.'},
    {'day': 'Day 3', 'title': 'Nubra Valley', 'desc': 'Drive over Khardung La (5,359m — world\'s highest motorable road). Nubra Valley sand dunes. Double-humped Bactrian camel ride.'},
    {'day': 'Day 4', 'title': 'Nubra to Pangong Lake', 'desc': 'Drive through Shyok Valley to Pangong Tso (4,350m). First sight of the electric blue lake will leave you speechless. Camp overnight by the lake.'},
    {'day': 'Day 5', 'title': 'Pangong Sunrise & Tso Moriri', 'desc': 'Watch sunrise turn the lake from black to gold to blue. Drive back via Chang La pass to Leh. Evening monastery visit.'},
    {'day': 'Day 6', 'title': 'Magnetic Hill & Confluence', 'desc': 'Magnetic Hill (vehicles roll uphill). Sangam — confluence of Indus and Zanskar rivers. Alchi monastery (11th century murals).'},
    {'day': 'Day 7', 'title': 'Leh Local & Market', 'desc': 'Leh Palace and old town walk. Tibetan handicrafts, Pashmina shawls, Turquoise jewellery. Farewell dinner with Ladakhi cuisine.'},
    {'day': 'Day 8', 'title': 'Departure', 'desc': 'Early morning flight from Leh. Carry home memories of the land of high passes and blue skies.'},
  ],
  'thailand-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive Bangkok', 'desc': 'Arrive Bangkok. Transfer to hotel. Evening rooftop bar with city views. Street food walk — Pad Thai, Som Tam, mango sticky rice.'},
    {'day': 'Day 2', 'title': 'Bangkok Temples', 'desc': 'Grand Palace & Wat Phra Kaew (Temple of the Emerald Buddha). Wat Pho (Reclining Buddha). Chao Phraya river boat. Chatuchak Weekend Market.'},
    {'day': 'Day 3', 'title': 'Elephant Sanctuary', 'desc': 'Day trip to ethical elephant sanctuary. Feed, bathe, and walk with rescued elephants. Bamboo rafting. Return to Bangkok.'},
    {'day': 'Day 4', 'title': 'Fly to Phuket', 'desc': 'Morning flight to Phuket. Transfer to beachfront resort. Patong Beach afternoon. Evening Bangla Road night market.'},
    {'day': 'Day 5', 'title': 'Phi Phi Islands', 'desc': 'Full day speedboat tour to Phi Phi Don and Phi Phi Leh. Maya Bay (The Beach). Snorkelling. Viking Cave viewpoint.'},
    {'day': 'Day 6', 'title': 'Krabi Limestone Cliffs', 'desc': 'Longtail boat to Railay Beach (only reachable by sea). Rock climbing on limestone karsts. 4-island tour.'},
    {'day': 'Day 7', 'title': 'Departure', 'desc': 'Morning yoga on the beach. Last Thai breakfast. Transfer to Phuket airport. Sawadee kha — Thailand bids goodbye.'},
  ],
  'varanasi-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive Sacred Varanasi', 'desc': 'Arrive Varanasi. Evening boat ride on the Ganges to witness Ganga Aarti — a thousand lamps light the river. An unforgettable ceremony.'},
    {'day': 'Day 2', 'title': 'Dawn Boat Ride & Ghats', 'desc': 'Pre-sunrise boat ride as the city wakes. Dashashwamedh Ghat, Manikarnika (cremation) Ghat. Kashi Vishwanath Temple. Old lanes of Varanasi.'},
    {'day': 'Day 3', 'title': 'Sarnath & Departure', 'desc': 'Drive to Sarnath where Buddha gave his first sermon. Dhamek Stupa, Archaeological Museum with Sarnath Lion Capital. Return and depart.'},
  ],
  'singapore-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive Singapore', 'desc': 'Arrive Changi Airport (world\'s best airport). Transfer to hotel. Evening Marina Bay Sands rooftop infinity pool. Gardens by the Bay light show.'},
    {'day': 'Day 2', 'title': 'Iconic Singapore', 'desc': 'Marina Bay Sands observation deck. Merlion Park. Helix Bridge. Gardens by the Bay — Supertree Grove, Cloud Forest, Flower Dome.'},
    {'day': 'Day 3', 'title': 'Sentosa & Universal Studios', 'desc': 'Universal Studios Singapore (Hollywood, Jurassic Park, Transformers). S.E.A. Aquarium. Cable car to Sentosa Island. Wings of Time show.'},
    {'day': 'Day 4', 'title': 'Chinatown & Little India', 'desc': 'Chinatown Heritage Centre, Sri Mariamman Temple. Little India\'s Mustafa Centre. Clarke Quay night bazaar. Singapore Sling at Raffles Hotel.'},
    {'day': 'Day 5', 'title': 'Orchard Road & Departure', 'desc': 'Morning shopping on Orchard Road. Singapore Botanic Gardens (UNESCO site). Transfer to Changi Airport.'},
  ],
  'coorg-tour-package': [
    {'day': 'Day 1', 'title': 'Arrive in Coorg', 'desc': 'Drive from Bangalore to Coorg (5 hrs). Check-in to a coffee plantation homestay. Evening coffee estate walk. Dinner with Coorgi pork curry.'},
    {'day': 'Day 2', 'title': 'Abbey Falls & Nagarhole', 'desc': 'Abbey Falls trek through coffee and spice estates. Afternoon jeep safari in Nagarhole Tiger Reserve — elephants, deer, wild boar.'},
    {'day': 'Day 3', 'title': 'Mysore Day Trip', 'desc': 'Drive to Mysore. Mysore Palace — illuminated with 97,000 light bulbs on Sundays. Chamundi Hill, Devaraja Market. Return to Coorg.'},
    {'day': 'Day 4', 'title': 'Departure', 'desc': 'Morning spice trail walk — cardamom, pepper, vanilla. Coffee tasting session. Drive back to Bangalore for departure.'},
  ],
};

// ── Gallery images per package ────────────────────────────────────────────────
const _galleries = <String, List<String>>{
  'kashmir-tour-package': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1572205088146-8d05c8b77af5?w=800&q=80',
    'https://images.unsplash.com/photo-1609766418204-94aae0ecbe63?w=800&q=80',
  ],
  'bali-honeymoon-package': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80',
  ],
  'kerala-tour-package': [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
    'https://images.unsplash.com/photo-1622659374680-0e0ebb78b6e3?w=800&q=80',
  ],
  'dubai-tour-package-from-delhi': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
    'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80',
    'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80',
  ],
  'maldives-luxury-package': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80',
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80',
    'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80',
  ],
};

String _fallbackImg(String slug, String mainImg) {
  if (_galleries.containsKey(slug)) return mainImg;
  return mainImg;
}

List<String> _galleryFor(String slug, String mainImg) {
  final g = _galleries[slug];
  if (g != null && g.isNotEmpty) return g;
  return [mainImg, mainImg, mainImg];
}

List<Map<String, String>> _itineraryFor(String slug, int nights) {
  final it = _itineraries[slug];
  if (it != null) return it;
  // Generic fallback based on nights
  return List.generate(nights + 1, (i) {
    if (i == 0) return {'day': 'Day 1', 'title': 'Arrival & Check-in', 'desc': 'Arrive at destination. Transfer to hotel. Welcome briefing and evening orientation walk. Dinner at local restaurant.'};
    if (i == nights) return {'day': 'Day ${i+1}', 'title': 'Departure', 'desc': 'Breakfast at hotel. Check-out. Last-minute shopping. Transfer to airport for departure.'};
    return {'day': 'Day ${i+1}', 'title': 'Local Exploration', 'desc': 'Guided sightseeing of top attractions. Visit markets, landmarks, and cultural sites. Evening at leisure.'};
  });
}


// ── Best Time to Visit data ───────────────────────────────────────────────────
const _bestTimeData = <String, Map<String, dynamic>>{
  'kashmir-tour-package': {
    'best': 'Apr – Jun & Sep – Nov',
    'avoid': 'Dec – Feb (heavy snowfall, roads close)',
    'months': ['❄️Jan', '❄️Feb', '🌸Mar', '✅Apr', '✅May', '✅Jun', '🌧️Jul', '🌧️Aug', '✅Sep', '✅Oct', '✅Nov', '❄️Dec'],
    'weather': 'Spring (Apr-Jun) brings blooming flowers and pleasant 15-25°C. Autumn (Sep-Nov) has clear skies and golden chinar trees.',
    'tip': '⭐ Best avoided during peak summer (Jul-Aug) due to heavy rains and peak monsoon.',
  },
  'bali-honeymoon-package': {
    'best': 'May – Sep (Dry Season)',
    'avoid': 'Dec – Mar (heavy monsoon rains)',
    'months': ['🌧️Jan', '🌧️Feb', '🌧️Mar', '🌤️Apr', '✅May', '✅Jun', '✅Jul', '✅Aug', '✅Sep', '🌤️Oct', '🌧️Nov', '🌧️Dec'],
    'weather': 'Dry season (May-Sep) offers sunny days at 27-32°C with cool evenings. Perfect beach and temple weather.',
    'tip': '⭐ July-August is peak season — book 3 months in advance for honeymoon villas.',
  },
  'kerala-tour-package': {
    'best': 'Oct – Mar (Post-Monsoon & Winter)',
    'avoid': 'Jun – Aug (intense monsoon, floods possible)',
    'months': ['✅Jan', '✅Feb', '✅Mar', '🌤️Apr', '🌤️May', '🌧️Jun', '🌧️Jul', '🌧️Aug', '🌤️Sep', '✅Oct', '✅Nov', '✅Dec'],
    'weather': 'October to March is ideal with 22-32°C, calm backwaters, and clear beaches. Monsoon (Jun-Aug) offers lush greenery but rough seas.',
    'tip': '⭐ Houseboat bookings at 50% higher in December — plan ahead or visit in November for best value.',
  },
  'dubai-tour-package-from-delhi': {
    'best': 'Nov – Mar (Cool & Pleasant)',
    'avoid': 'Jun – Sep (extreme heat 40-50°C)',
    'months': ['✅Jan', '✅Feb', '✅Mar', '🌤️Apr', '🌤️May', '🌡️Jun', '🌡️Jul', '🌡️Aug', '🌡️Sep', '🌤️Oct', '✅Nov', '✅Dec'],
    'weather': 'November to March is the golden window — 20-28°C, no humidity, perfect for desert safari and sightseeing.',
    'tip': '⭐ Visit in December for Dubai Shopping Festival or January for DSF sales on luxury brands.',
  },
  'maldives-luxury-package': {
    'best': 'Nov – Apr (Dry Season)',
    'avoid': 'May – Oct (South-West Monsoon, rough seas)',
    'months': ['✅Jan', '✅Feb', '✅Mar', '✅Apr', '🌧️May', '🌧️Jun', '🌧️Jul', '🌧️Aug', '🌧️Sep', '🌤️Oct', '✅Nov', '✅Dec'],
    'weather': 'Dry season brings crystal-clear waters (30m+ visibility), 25-30°C, and perfect snorkelling/diving conditions.',
    'tip': '⭐ Manta ray season runs February-April — best time to spot them at Baa Atoll.',
  },
  'goa-tour-package': {
    'best': 'Nov – Feb (Peak Season)',
    'avoid': 'Jun – Sep (monsoon, rough sea, most shacks closed)',
    'months': ['✅Jan', '✅Feb', '🌤️Mar', '🌤️Apr', '🌤️May', '🌧️Jun', '🌧️Jul', '🌧️Aug', '🌧️Sep', '🌤️Oct', '✅Nov', '✅Dec'],
    'weather': 'November to February is perfect at 20-30°C with calm seas, lively beach shacks, and water sports.',
    'tip': '⭐ December-January is most expensive — visit in November or February for better hotel rates.',
  },
  'manali-tour-package': {
    'best': 'Apr – Jun & Sep – Nov',
    'avoid': 'Jan – Feb (extreme cold, Rohtang closed)',
    'months': ['❄️Jan', '❄️Feb', '🌸Mar', '✅Apr', '✅May', '✅Jun', '🌧️Jul', '🌧️Aug', '✅Sep', '✅Oct', '✅Nov', '❄️Dec'],
    'weather': 'Summer (Apr-Jun) is perfect for Rohtang Pass and adventure activities at 15-25°C. Autumn clear skies offer Himalayan views.',
    'tip': '⭐ For snow activities, go in January-February but expect road closures. For everything else, May-June is ideal.',
  },
  'golden-triangle-10-day': {
    'best': 'Oct – Mar (Cool & Clear)',
    'avoid': 'Apr – Jun (extreme heat, 40-48°C in Rajasthan)',
    'months': ['✅Jan', '✅Feb', '✅Mar', '🌡️Apr', '🌡️May', '🌡️Jun', '🌧️Jul', '🌧️Aug', '🌤️Sep', '✅Oct', '✅Nov', '✅Dec'],
    'weather': 'October to March is ideal — 15-25°C for Agra and Jaipur. The Taj Mahal looks its most magical on misty winter mornings.',
    'tip': '⭐ Full moon nights at Taj Mahal (booking required) — check the lunar calendar when planning your trip.',
  },
  'rajasthan-heritage-7-day': {
    'best': 'Oct – Mar (Winter, festivals)',
    'avoid': 'May – Jul (desert heat up to 50°C)',
    'months': ['✅Jan', '✅Feb', '✅Mar', '🌡️Apr', '🌡️May', '🌡️Jun', '🌧️Jul', '🌧️Aug', '🌤️Sep', '✅Oct', '✅Nov', '✅Dec'],
    'weather': 'October to March: 10-25°C, clear desert skies, Pushkar Fair (November), and Jaipur Literature Festival (January).',
    'tip': '⭐ Rajasthan is magical during winter festivals — Diwali illuminates every fort and palace.',
  },
};

// ── Visa Information data ─────────────────────────────────────────────────────
const _visaData = <String, Map<String, String>>{
  'bali-honeymoon-package': {
    'type': 'Visa on Arrival',
    'fee': '\$35 USD (~₹2,900)',
    'validity': '30 days (extendable)',
    'processing': 'Instant at Bali airport',
    'required': 'Passport valid 6+ months, return ticket, hotel booking proof',
    'note': '✅ Easy — obtained at the airport on arrival. No prior paperwork needed.',
  },
  'dubai-tour-package-from-delhi': {
    'type': 'Tourist Visa (Required)',
    'fee': '₹5,500 – ₹7,000 (30-day) | ₹9,500 (60-day)',
    'validity': '30 or 60 days',
    'processing': '3-5 working days',
    'required': 'Passport valid 6+ months, passport photo, bank statement (3 months), confirmed hotel',
    'note': '✅ YlooTrips handles your UAE visa application — we submit on your behalf!',
  },
  'maldives-luxury-package': {
    'type': 'Free Visa on Arrival',
    'fee': 'FREE',
    'validity': '30 days',
    'processing': 'Instant at Malé airport',
    'required': 'Valid passport, return ticket, confirmed hotel / resort booking',
    'note': '✅ No cost, no paperwork — smoothest visa in the world!',
  },
};

// Domestic packages needing no visa
const _domesticSlugs = {
  'kashmir-tour-package', 'kerala-tour-package', 'goa-tour-package',
  'manali-tour-package', 'golden-triangle-10-day', 'rajasthan-heritage-7-day',
  'kerala-south-india-14-day',
};

bool _isDomestic(String slug) => _domesticSlugs.contains(slug);

// ── Main Screen ───────────────────────────────────────────────────────────────
class PackageDetailScreen extends StatefulWidget {
  final Map<String, dynamic> packageData;
  const PackageDetailScreen({super.key, required this.packageData});

  @override
  State<PackageDetailScreen> createState() => _PackageDetailScreenState();
}

class _PackageDetailScreenState extends State<PackageDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  int _imgIdx = 0;
  final _pageCtrl = PageController();
  bool _wishlisted = false;

  Map<String, dynamic> get pkg => widget.packageData;
  String get slug => pkg['slug'] as String? ?? '';
  String get mainImg => pkg['imageUrl'] as String? ?? '';

  List<String> get gallery => _galleryFor(slug, mainImg);
  List<Map<String, String>> get itinerary => _itineraryFor(slug, nights);

  int get nights => (pkg['nights'] as num?)?.toInt() ?? 5;
  int get days => (pkg['days'] as num?)?.toInt() ?? 6;
  int get price => (pkg['price'] as num?)?.toInt() ?? 0;
  double get rating => (pkg['rating'] as num?)?.toDouble() ?? 4.8;
  int get reviews => (pkg['reviews'] as num?)?.toInt() ?? 100;
  String get title => pkg['title'] as String? ?? 'Package';
  String get destination => pkg['destination'] as String? ?? '';
  String get description => pkg['description'] as String? ?? '';
  String get discount => pkg['discount']?.toString() ?? '0';
  List<String> get highlights {
    final h = pkg['highlights'];
    if (h is List) return h.map((e) => e.toString()).toList();
    return ['Professional guide', 'All transfers', 'Handpicked hotels', 'Daily breakfast'];
  }

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 4, vsync: this);
    _loadWishlist();
  }

  Future<void> _loadWishlist() async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = prefs.getStringList('wishlist') ?? [];
    if (mounted) setState(() => _wishlisted = slugs.contains(slug));
  }

  Future<void> _toggleWishlist() async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = (prefs.getStringList('wishlist') ?? []).toList();
    if (_wishlisted) {
      slugs.remove(slug);
    } else {
      if (!slugs.contains(slug)) slugs.add(slug);
    }
    await prefs.setStringList('wishlist', slugs);
    setState(() => _wishlisted = !_wishlisted);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(_wishlisted ? '❤️ Added to Saved Trips' : 'Removed from wishlist'),
        backgroundColor: AppTheme.secondary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        duration: const Duration(seconds: 1),
      ));
    }
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _pageCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currency = context.watch<CurrencyProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      bottomNavigationBar: _buildBottomBar(currency),
      body: NestedScrollView(
        headerSliverBuilder: (ctx, _) => [_buildHero()],
        body: Column(children: [
          _buildTabs(),
          Expanded(
            child: TabBarView(
              controller: _tabCtrl,
              children: [
                ListView(padding: const EdgeInsets.only(bottom: 32), children: [
                  _OverviewTab(
                    description: description, highlights: highlights,
                    nights: nights, days: days, rating: rating,
                    reviews: reviews, currency: currency, price: price,
                  ),
                ]),
                ListView(padding: const EdgeInsets.only(bottom: 32), children: [
                  _ItineraryTab(itinerary: itinerary),
                ]),
                ListView(padding: const EdgeInsets.only(bottom: 32), children: [
                  const _InclusionsTab(),
                ]),
                ListView(padding: const EdgeInsets.only(bottom: 32), children: [
                  _InfoTab(slug: slug),
                ]),
              ],
            ),
          ),
        ]),
      ),
    );
  }

  Widget _buildHero() => SliverAppBar(
    expandedHeight: 300,
    pinned: true,
    backgroundColor: AppTheme.primary,
    foregroundColor: Colors.white,
    leading: Builder(builder: (ctx) => IconButton(
      icon: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(color: Colors.black38, shape: BoxShape.circle),
        child: const Icon(Icons.arrow_back_ios_rounded, color: Colors.white, size: 16),
      ),
      onPressed: () => GoRouter.of(ctx).pop(),
    )),
    actions: [
      IconButton(
        icon: Icon(_wishlisted ? Icons.favorite_rounded : Icons.favorite_border_rounded,
            color: _wishlisted ? const Color(0xFFFF6B6B) : Colors.white),
        onPressed: _toggleWishlist,
        tooltip: _wishlisted ? 'Remove from wishlist' : 'Save to wishlist',
      ),
    ],
    flexibleSpace: FlexibleSpaceBar(
      background: Stack(fit: StackFit.expand, children: [
        // Gallery carousel
        PageView.builder(
          controller: _pageCtrl,
          itemCount: gallery.length,
          onPageChanged: (i) => setState(() => _imgIdx = i),
          itemBuilder: (_, i) => CachedNetworkImage(
            imageUrl: gallery[i],
            fit: BoxFit.cover,
            placeholder: (_, __) => Container(color: AppTheme.creamDark),
            errorWidget: (_, __, ___) => Container(color: AppTheme.creamDark),
          ),
        ),
        // Dark gradient
        const DecoratedBox(decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [Colors.transparent, Color(0xCC000000)],
            stops: [0.4, 1.0],
          ),
        )),
        // Badges top
        Positioned(top: kToolbarHeight + 8, left: 16, right: 16,
          child: Row(children: [
            _PillBadge('★ $rating', bg: Colors.white, text: AppTheme.primary),
            const SizedBox(width: 8),
            _PillBadge('${nights}N/${days}D', bg: AppTheme.secondary, text: Colors.white),
            const Spacer(),
            if (int.tryParse(discount) != null && int.parse(discount) > 0)
              _PillBadge('$discount% OFF', bg: Colors.red, text: Colors.white),
          ]),
        ),
        // Title & destination bottom
        Positioned(left: 16, right: 16, bottom: 16,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.location_on, size: 13, color: Colors.white70),
              const SizedBox(width: 4),
              Text(destination, style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
            ]),
            const SizedBox(height: 4),
            Text(title, style: GoogleFonts.playfairDisplay(
              fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white, height: 1.2)),
            const SizedBox(height: 8),
            // Image dots
            if (gallery.length > 1)
              Row(children: List.generate(gallery.length, (i) => AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: _imgIdx == i ? 16 : 6, height: 6,
                margin: const EdgeInsets.only(right: 4),
                decoration: BoxDecoration(
                  color: _imgIdx == i ? Colors.white : Colors.white38,
                  borderRadius: BorderRadius.circular(3),
                ),
              ))),
          ]),
        ),
      ]),
    ),
  );

  Widget _buildTabs() => Container(
    color: AppTheme.white,
    child: TabBar(
      controller: _tabCtrl,
      isScrollable: true,
      tabAlignment: TabAlignment.start,
      labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700),
      unselectedLabelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w400),
      labelColor: AppTheme.secondary,
      unselectedLabelColor: AppTheme.textGray,
      indicatorColor: AppTheme.secondary,
      indicatorWeight: 2,
      tabs: const [
        Tab(text: 'Overview'),
        Tab(text: 'Itinerary'),
        Tab(text: 'Inclusions'),
      ],
    ),
  );


  Widget _buildBottomBar(CurrencyProvider currency) => SafeArea(
    top: false,
    child: Container(
    padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
    decoration: BoxDecoration(
      color: AppTheme.white,
      border: Border(top: BorderSide(color: AppTheme.borderGray)),
      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 12, offset: const Offset(0, -4))],
    ),
    child: Row(children: [
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Starting from', style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
        Text(currency.format(price.toDouble()),
          style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.primary)),
        Text('per person · excl. flights',
          style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
      ]),
      const Spacer(),
      Row(children: [
        // WhatsApp
        GestureDetector(
          onTap: () async {
            final url = Uri.parse(AppConfig.whatsappUrl('Hi! I\'m interested in the $title package. Please share more details.'));
            if (await canLaunchUrl(url)) launchUrl(url, mode: LaunchMode.externalApplication);
          },
          child: Container(
            width: 46, height: 46,
            margin: const EdgeInsets.only(right: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF25D366),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.chat_rounded, color: Colors.white, size: 22),
          ),
        ),
        // Book & Pay
        ElevatedButton.icon(
          onPressed: () => showBookingPaymentSheet(
            context,
            type: 'package',
            title: title,
            price: price,
            extraData: {
              'packageId': pkg['id'],
              'destination': destination,
              'nights': nights, 'days': days,
              'slug': slug,
            },
          ),
          icon: const Icon(Icons.credit_card, size: 16),
          label: const Text('Book & Pay'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.secondary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700),
            elevation: 0,
          ),
        ),
      ]),
    ]),
  ));
}

// ── Overview Tab ─────────────────────────────────────────────────────────────
class _OverviewTab extends StatelessWidget {
  final String description;
  final List<String> highlights;
  final int nights, days, reviews;
  final double rating;
  final CurrencyProvider currency;
  final int price;

  const _OverviewTab({
    required this.description, required this.highlights,
    required this.nights, required this.days,
    required this.rating, required this.reviews,
    required this.currency, required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Stats row
        Row(children: [
          _StatBox('${nights}N', '${days}D', Icons.nights_stay_outlined),
          const SizedBox(width: 10),
          _StatBox('$rating', '${reviews} Reviews', Icons.star_rounded),
          const SizedBox(width: 10),
          _StatBox(currency.format(price.toDouble()), 'per person', Icons.currency_rupee),
        ]),
        const SizedBox(height: 20),
        Text('About this trip', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(description, style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textGray, height: 1.7)),
        const SizedBox(height: 20),
        Text('Highlights', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...highlights.map((h) => Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 20, height: 20,
              margin: const EdgeInsets.only(top: 1),
              decoration: const BoxDecoration(color: AppTheme.secondary, shape: BoxShape.circle),
              child: const Icon(Icons.check, size: 12, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Expanded(child: Text(h, style: GoogleFonts.inter(fontSize: 13, color: AppTheme.primary, height: 1.4))),
          ]),
        )),
      ]),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String top, bottom;
  final IconData icon;
  const _StatBox(this.top, this.bottom, this.icon);

  @override
  Widget build(BuildContext context) => Expanded(
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderGray),
      ),
      child: Column(children: [
        Icon(icon, size: 18, color: AppTheme.secondary),
        const SizedBox(height: 4),
        Text(top, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.primary)),
        Text(bottom, style: GoogleFonts.inter(fontSize: 9, color: AppTheme.textGray), textAlign: TextAlign.center),
      ]),
    ),
  );
}

// ── Itinerary Tab ─────────────────────────────────────────────────────────────
class _ItineraryTab extends StatelessWidget {
  final List<Map<String, String>> itinerary;
  const _ItineraryTab({required this.itinerary});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Day-by-Day Itinerary', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text('${itinerary.length} days of curated experiences', style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
          const SizedBox(height: 16),
          ...itinerary.asMap().entries.map((entry) {
            final i = entry.key;
            final day = entry.value;
            final isLast = i == itinerary.length - 1;
            return IntrinsicHeight(
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                // Timeline
                Column(children: [
                  Container(
                    width: 36, height: 36,
                    decoration: BoxDecoration(
                      color: i == 0 ? AppTheme.secondary : (isLast ? AppTheme.primary : AppTheme.creamDark),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.secondary, width: 2),
                    ),
                    child: Center(child: Text('${i+1}', style: GoogleFonts.inter(
                      fontSize: 12, fontWeight: FontWeight.w800,
                      color: (i == 0 || isLast) ? Colors.white : AppTheme.secondary))),
                  ),
                  if (!isLast) Expanded(child: Container(
                    width: 2, margin: const EdgeInsets.symmetric(vertical: 4),
                    color: AppTheme.borderGray,
                  )),
                ]),
                const SizedBox(width: 14),
                // Content
                Expanded(child: Container(
                  margin: EdgeInsets.only(bottom: isLast ? 0 : 16),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: i == 0 ? AppTheme.secondary.withValues(alpha: 0.3) : AppTheme.borderGray),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0,2))],
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppTheme.secondary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(day['day']!, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.secondary)),
                    ),
                    const SizedBox(height: 6),
                    Text(day['title']!, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                    const SizedBox(height: 6),
                    Text(day['desc']!, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray, height: 1.6)),
                  ]),
                )),
              ]),
            );
          }),
        ],
      ),
    );
  }
}

// ── Inclusions Tab ────────────────────────────────────────────────────────────
class _InclusionsTab extends StatelessWidget {
  const _InclusionsTab();

  static const _included = [
    (Icons.hotel_outlined, 'Accommodation', '4★ & 5★ hotels throughout the trip'),
    (Icons.restaurant_outlined, 'Meals', 'Daily breakfast + welcome & farewell dinners'),
    (Icons.directions_bus_outlined, 'All Transfers', 'Airport, hotel & inter-city AC vehicle'),
    (Icons.person_outlined, 'Expert Guide', 'English-speaking local guide throughout'),
    (Icons.local_activity_outlined, 'Sightseeing', 'All entry tickets and listed activities'),
    (Icons.flight_outlined, 'Flights', 'Return airfare from your nearest city'),
    (Icons.sim_card_outlined, 'SIM Card', 'Local data SIM for the duration of trip'),
    (Icons.security_outlined, 'Travel Insurance', 'Comprehensive travel insurance coverage'),
  ];

  static const _excluded = [
    'Personal expenses and tips',
    'Optional activities not listed',
    'Meals not mentioned in itinerary',
    'Visa fees (if applicable)',
    'Camera fees at monuments',
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('What\'s Included', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ..._included.map((item) => Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.borderGray),
          ),
          child: Row(children: [
            Container(
              width: 36, height: 36,
              decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(9)),
              child: Icon(item.$1, size: 18, color: const Color(0xFF059669)),
            ),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(item.$2, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700)),
              Text(item.$3, style: GoogleFonts.inter(fontSize: 11, color: AppTheme.textGray)),
            ])),
            const Icon(Icons.check_circle, size: 18, color: Color(0xFF059669)),
          ]),
        )),
        const SizedBox(height: 20),
        Text('Not Included', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ..._excluded.map((e) => Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Row(children: [
            Container(
              width: 18, height: 18,
              decoration: const BoxDecoration(color: Color(0xFFFEE2E2), shape: BoxShape.circle),
              child: const Icon(Icons.close, size: 10, color: Color(0xFFEF4444)),
            ),
            const SizedBox(width: 10),
            Text(e, style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textGray)),
          ]),
        )),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF3C7),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(children: [
            const Icon(Icons.info_outline, color: Color(0xFF92400E), size: 18),
            const SizedBox(width: 10),
            Expanded(child: Text(
              'Only 25% advance required to confirm your booking. Balance due 30 days before departure.',
              style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF92400E), height: 1.5),
            )),
          ]),
        ),
      ]),
    );
  }
}

// ── Pill Badge ────────────────────────────────────────────────────────────────
class _PillBadge extends StatelessWidget {
  final String label;
  final Color bg, text;
  const _PillBadge(this.label, {required this.bg, required this.text});

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(20)),
    child: Text(label, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: text)),
  );

}
// ── Info Tab (Visa + Best Time + Offers + Payment) ───────────────────────────
class _InfoTab extends StatelessWidget {
  final String slug;
  const _InfoTab({required this.slug});

  @override
  Widget build(BuildContext context) {
    final visa = _visaData[slug];
    final bt = _bestTimeData[slug];
    final domestic = _isDomestic(slug);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

        // ── Current Offers ──────────────────────────────────────────────────
        Text('🎁 Current Offers', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        _offerCard(
          icon: Icons.local_offer_rounded,
          color: const Color(0xFF059669),
          bg: const Color(0xFFD1FAE5),
          title: 'Early Bird Discount',
          desc: 'Book 60+ days in advance and save up to 15% on total package cost.',
          badge: 'SAVE 15%',
        ),
        const SizedBox(height: 10),
        _offerCard(
          icon: Icons.people_rounded,
          color: const Color(0xFF1A73E8),
          bg: const Color(0xFFDBEAFE),
          title: 'Group Booking Offer',
          desc: 'Travelling with 6+ people? Get ₹5,000 cashback per person in your WanderLoot wallet.',
          badge: 'GROUP DEAL',
        ),
        const SizedBox(height: 10),
        _offerCard(
          icon: Icons.favorite_rounded,
          color: const Color(0xFFDB2777),
          bg: const Color(0xFFFCE7F3),
          title: 'Honeymoon Bonus',
          desc: 'Couples get complimentary room upgrade + flower decoration + welcome cake.',
          badge: 'FREE UPGRADE',
        ),
        const SizedBox(height: 10),
        _offerCard(
          icon: Icons.account_balance_wallet_rounded,
          color: const Color(0xFF7C3AED),
          bg: const Color(0xFFEDE9FE),
          title: 'WanderLoot Cashback',
          desc: 'Earn ₹2,500 – ₹10,000 cashback on every booking credited to your wallet.',
          badge: '₹2,500 BACK',
        ),

        const SizedBox(height: 24),

        // ── Payment Options ─────────────────────────────────────────────────
        Text('💳 Payment Options', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text('Flexible payment — book now, pay later', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
        const SizedBox(height: 12),
        _paymentRow(
          icon: Icons.arrow_downward_rounded,
          color: const Color(0xFF059669),
          title: 'Book with 25% Advance',
          desc: 'Pay only ₹XX,XXX now. Balance due 30 days before departure.',
          tag: 'MOST POPULAR',
          tagColor: const Color(0xFF059669),
        ),
        const SizedBox(height: 10),
        _paymentRow(
          icon: Icons.calendar_month_rounded,
          color: const Color(0xFF1A73E8),
          title: 'No Cost EMI',
          desc: '3, 6, or 9 month EMI via credit card. Zero processing fee.',
          tag: '0% EMI',
          tagColor: const Color(0xFF1A73E8),
        ),
        const SizedBox(height: 10),
        _paymentRow(
          icon: Icons.flash_on_rounded,
          color: const Color(0xFFD97706),
          title: 'Full Payment',
          desc: 'Pay 100% now and get additional 3% discount on total package.',
          tag: 'SAVE 3%',
          tagColor: const Color(0xFFD97706),
        ),
        Container(
          margin: const EdgeInsets.only(top: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF3C7),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(children: [
            const Icon(Icons.verified_user_rounded, color: Color(0xFF92400E), size: 20),
            const SizedBox(width: 10),
            Expanded(child: Text(
              'All payments secured by Easebuzz payment gateway. UPI · Cards · Net Banking · EMI supported.',
              style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF92400E), height: 1.5),
            )),
          ]),
        ),

        const SizedBox(height: 24),

        // ── Best Time to Visit ──────────────────────────────────────────────
        Text('📅 Best Time to Visit', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        if (bt != null) ...[
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF0F4C81), Color(0xFF1A73E8)]),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                const Icon(Icons.check_circle_outline, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text('Best Time:', style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
                const SizedBox(width: 6),
                Expanded(child: Text(bt['best'] as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white))),
              ]),
              const SizedBox(height: 8),
              Row(children: [
                const Icon(Icons.do_not_disturb_on_outlined, color: Colors.white70, size: 18),
                const SizedBox(width: 8),
                Text('Avoid:', style: GoogleFonts.inter(fontSize: 12, color: Colors.white70)),
                const SizedBox(width: 6),
                Expanded(child: Text(bt['avoid'] as String, style: GoogleFonts.inter(fontSize: 12, color: Colors.white70))),
              ]),
            ]),
          ),
          const SizedBox(height: 12),
          // Month grid
          Wrap(
            spacing: 6, runSpacing: 6,
            children: (bt['months'] as List<dynamic>).map<Widget>((m) {
              final ms = m as String;
              final isGood = ms.startsWith('✅');
              final isBad = ms.startsWith('🌡️') || ms.startsWith('❄️') || ms.startsWith('🌧️');
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: isGood ? const Color(0xFFD1FAE5) : (isBad ? const Color(0xFFFEE2E2) : const Color(0xFFFEF3C7)),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isGood ? const Color(0xFF059669) : (isBad ? const Color(0xFFEF4444) : const Color(0xFFD97706)),
                    width: 1,
                  ),
                ),
                child: Text(ms, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600,
                  color: isGood ? const Color(0xFF065F46) : (isBad ? const Color(0xFF991B1B) : const Color(0xFF92400E)))),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFF0F5FF), borderRadius: BorderRadius.circular(12)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('🌤 Weather Overview', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFF1E40AF))),
              const SizedBox(height: 6),
              Text(bt['weather'] as String, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF374151), height: 1.6)),
              const SizedBox(height: 8),
              Text(bt['tip'] as String, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF1E40AF))),
            ]),
          ),
        ] else
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: const Color(0xFFF0F5FF), borderRadius: BorderRadius.circular(12)),
            child: Text('Best time varies — contact our travel experts for personalised advice.',
              style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF374151))),
          ),

        const SizedBox(height: 24),

        // ── Visa Information ────────────────────────────────────────────────
        Text('🛂 Visa Information', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        if (domestic)
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF059669), Color(0xFF10B981)]),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(children: [
              const Icon(Icons.check_circle_rounded, color: Colors.white, size: 28),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('No Visa Required', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                Text('This is a domestic India trip — Indian passport holders travel freely.', style: GoogleFonts.inter(fontSize: 12, color: Colors.white.withValues(alpha: 0.9), height: 1.4)),
              ])),
            ]),
          )
        else if (visa != null) ...[
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE5E7EB)),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2))],
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              _visaRow(Icons.approval_rounded, 'Visa Type', visa['type']!),
              const Divider(height: 20),
              _visaRow(Icons.currency_rupee_rounded, 'Visa Fee', visa['fee']!),
              const Divider(height: 20),
              _visaRow(Icons.timer_rounded, 'Processing Time', visa['processing']!),
              const Divider(height: 20),
              _visaRow(Icons.date_range_rounded, 'Validity', visa['validity']!),
              const Divider(height: 20),
              _visaRow(Icons.description_rounded, 'Documents Required', visa['required']!),
            ]),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              const Icon(Icons.handshake_rounded, color: Color(0xFF059669), size: 20),
              const SizedBox(width: 10),
              Expanded(child: Text(visa['note']!, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF065F46), height: 1.4))),
            ]),
          ),
        ] else
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              const Icon(Icons.info_outline, color: Color(0xFF92400E), size: 20),
              const SizedBox(width: 10),
              Expanded(child: Text(
                'Visa requirements vary by nationality. Contact us for specific visa guidance.',
                style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF92400E), height: 1.4),
              )),
            ]),
          ),

        const SizedBox(height: 24),

        // ── Price Note ──────────────────────────────────────────────────────
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFF9FAFB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('💡 Price Note', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: const Color(0xFF111827))),
            const SizedBox(height: 8),
            _priceNoteRow('✈️ Flights', domestic ? 'Not included — domestic flights add ₹4,000-₹12,000' : 'Not included in base price — add international flights'),
            _priceNoteRow('🏨 Hotels', 'Included — 4★ & 5★ properties as listed'),
            _priceNoteRow('🍽️ Meals', 'Daily breakfast + listed meals included'),
            _priceNoteRow('🚗 Transfers', 'All local transport included'),
            _priceNoteRow('🎫 Activities', 'All listed sightseeing included'),
          ]),
        ),

        const SizedBox(height: 32),
      ]),
    );
  }

  Widget _offerCard({required IconData icon, required Color color, required Color bg, required String title, required String desc, required String badge}) =>
    Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2))]),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(width: 40, height: 40, decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, size: 20, color: color)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: const Color(0xFF111827)))),
            Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
              child: Text(badge, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: color))),
          ]),
          const SizedBox(height: 4),
          Text(desc, style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF6B7280), height: 1.5)),
        ])),
      ]),
    );

  Widget _paymentRow({required IconData icon, required Color color, required String title, required String desc, required String tag, required Color tagColor}) =>
    Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE5E7EB))),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(width: 38, height: 38, decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, size: 20, color: color)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700))),
            Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(color: tagColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
              child: Text(tag, style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: tagColor))),
          ]),
          const SizedBox(height: 4),
          Text(desc, style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF6B7280), height: 1.5)),
        ])),
      ]),
    );

  Widget _visaRow(IconData icon, String label, String value) => Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Icon(icon, size: 18, color: const Color(0xFF1A73E8)),
    const SizedBox(width: 10),
    SizedBox(width: 110, child: Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF374151)))),
    Expanded(child: Text(value, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280), height: 1.4))),
  ]);

  Widget _priceNoteRow(String label, String value) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF374151))),
      const SizedBox(width: 8),
      Expanded(child: Text(value, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280)))),
    ]),
  );
}
