import axios from 'axios';

async function fetchDiscussions(brojZatrazenihDiskusija) {
  try {
    const response = await axios.post('/allDiscussions', {
      "brojZatrazenihDiskusija": brojZatrazenihDiskusija,
    });

    const discussions = response.data;
    console.log(discussions); // Process or display the discussions as needed
  } catch (error) {
    console.error("Error fetching discussions:", error);
  }
}

// Example usage
fetchDiscussions(10); // Fetch the 10 most recent discussions