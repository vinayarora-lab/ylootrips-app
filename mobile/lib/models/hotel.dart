class Hotel {
  final String id;
  final String name;
  final String location;
  final String city;
  final String imageUrl;
  final double rating;
  final int reviews;
  final int pricePerNight;
  final String category;
  final List<String> amenities;
  final String description;

  const Hotel({
    required this.id,
    required this.name,
    required this.location,
    required this.city,
    required this.imageUrl,
    required this.rating,
    required this.reviews,
    required this.pricePerNight,
    required this.category,
    required this.amenities,
    required this.description,
  });

  factory Hotel.fromJson(Map<String, dynamic> j) => Hotel(
        id: j['_id'] ?? j['id'] ?? '',
        name: j['name'] ?? '',
        location: j['location'] ?? '',
        city: j['city'] ?? '',
        imageUrl: j['imageUrl'] ?? j['image'] ?? '',
        rating: (j['rating'] ?? 4.0).toDouble(),
        reviews: (j['reviews'] ?? 0).toInt(),
        pricePerNight: (j['pricePerNight'] ?? j['price'] ?? 0).toInt(),
        category: j['category'] ?? 'hotel',
        amenities: (j['amenities'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            [],
        description: j['description'] ?? '',
      );
}

class HotelSearchResult {
  final List<Hotel> hotels;
  final bool isDemo;

  const HotelSearchResult({required this.hotels, required this.isDemo});
}
