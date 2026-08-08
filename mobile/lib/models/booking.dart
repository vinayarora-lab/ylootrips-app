class Passenger {
  String title;
  String firstName;
  String lastName;
  String dob;
  String gender;
  String nationality;
  String passportNo;
  String passportExpiry;

  Passenger({
    this.title = 'Mr',
    this.firstName = '',
    this.lastName = '',
    this.dob = '',
    this.gender = 'Male',
    this.nationality = 'Indian',
    this.passportNo = '',
    this.passportExpiry = '',
  });

  Map<String, dynamic> toJson() => {
        'title': title,
        'firstName': firstName,
        'lastName': lastName,
        'dob': dob,
        'gender': gender,
        'nationality': nationality,
        'passportNo': passportNo,
        'passportExpiry': passportExpiry,
      };

  bool get isValid => firstName.isNotEmpty && lastName.isNotEmpty && dob.isNotEmpty;

  bool isValidForInternational() =>
      isValid && passportNo.isNotEmpty && passportExpiry.isNotEmpty;
}

class ContactDetails {
  String email;
  String phone;

  ContactDetails({this.email = '', this.phone = ''});

  bool get isValid =>
      email.contains('@') && email.contains('.') && phone.length >= 10;

  Map<String, dynamic> toJson() => {'email': email, 'phone': phone};
}

class FlightBooking {
  final Map<String, dynamic> flight;
  final List<Passenger> passengers;
  final ContactDetails contact;
  final String paymentMethod;

  const FlightBooking({
    required this.flight,
    required this.passengers,
    required this.contact,
    required this.paymentMethod,
  });

  Map<String, dynamic> toJson() => {
        'flight': flight,
        'passengers': passengers.map((p) => p.toJson()).toList(),
        'contact': contact.toJson(),
        'paymentMethod': paymentMethod,
      };
}
