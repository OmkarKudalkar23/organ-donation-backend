/**
 * Blood Type Compatibility Rules:
 * O-  → can donate to: O-, O+, A-, A+, B-, B+, AB-, AB+
 * O+  → can donate to: O+, A+, B+, AB+
 * A-  → can donate to: A-, A+, AB-, AB+
 * A+  → can donate to: A+, AB+
 * B-  → can donate to: B-, B+, AB-, AB+
 * B+  → can donate to: B+, AB+
 * AB- → can donate to: AB-, AB+
 * AB+ → can donate to: AB+
 */

const getMatchedDonors = (patient, donors) => {
    const bloodCompatibility = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    };

    return donors.filter(donor => {
        // 1. donor.isAvailable === true
        if (!donor.isAvailable) return false;

        // 2. donor's bloodType is compatible with patient.bloodType
        // Note: donor.bloodType must be in the list of types that can donate TO patient.bloodType
        // OR patient.bloodType must be in the list of types that donor.bloodType can donate to.
        // The rule says: "O- can donate to O-". So if patient is O-, donor must be O-.
        // If patient is AB+, donor can be anything.
        
        const donorCanDonateTo = bloodCompatibility[donor.bloodType] || [];
        const isBloodCompatible = donorCanDonateTo.includes(patient.bloodType);

        if (!isBloodCompatible) return false;

        // 3. donor.organsAvailable includes patient.organNeeded
        const hasOrgan = donor.organsAvailable.some(
            organ => organ.toLowerCase() === patient.organNeeded.toLowerCase()
        );

        return hasOrgan;
    });
};

export default getMatchedDonors;
