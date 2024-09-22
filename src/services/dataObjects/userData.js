export const userData = {
    userId: null, // Placeholder for the actual user ID
    name: {
        prefix: null,
        firstName: null,
        lastName: null,
        suffix: null,
    },
    contact: {
        cellPhone: null,
        email: null,
    },
    address: {
        primary: {
            line1: null,
            line2: null,
            city: null,
            state: null,
            zip: null,
        },
    },
    birthday: null,
    hashedPassword: null,
    paymentMethods: [],
    events: {
        past: [],
        future: [],
        favoriteEvents: [],
    },
    isHost: false,
    hostDetails: null, // Initialize as null, details will be added if 'isHost' is true
    createdAt: new Date(),
    updatedAt: new Date(),
};

if (userData.isHost) {
    userData.hostDetails = {
        hostType: 'individual', // Default to 'individual', can be changed later
        ratings: {
            overall: 0,
            reviews: [],
        },
    };

    if (userData.hostDetails.hostType === 'individual') {
        userData.hostDetails.individual = {
            bio: '',
            profilePicture: '',
        };
    } else if (userData.hostDetails.hostType === 'company') {
        userData.hostDetails.company = {
            companyName: '',
            companyBio: '',
            website: '',
            logo: '',
        };
    }

    userData.hostDetails.hostLocation = {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
    };
}