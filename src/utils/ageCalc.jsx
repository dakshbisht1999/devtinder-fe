const ageCalc = (dob) => { // yyyy-mm-dd
    // Calculate the age based on the DOB
    const today = new Date();
    const birthDate = new Date(dob);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust the age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default ageCalc;