const path = require('path')
const fs = require('fs')

function getImage(image_file_name) {
    const imagePath = path.join(__dirname, '../images/user_images', image_file_name);

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
        console.log("image path is wrong!")
    }

    // Read image file and convert to base64
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString('base64');

    return base64Image
}

module.exports = getImage