import React, { useState } from "react";
import "./Events.css"; // Import your CSS

const eventsData = [
  {
    id: 1,
    title: "Webinar: Future of Technology",
    department: "Tech Innovations",
    location: "Online",
    updatedOn: "Mar 20, 2025",
    tags: ["Webinar", "Technology"],
    price: 0,
    registrationDaysLeft: 10,
    description:
      "Join industry experts as they discuss emerging trends and innovations shaping the future of technology.",
    speakers: ["Dr. Alice Smith", "Mr. John Doe"],
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "Seminar: Digital Marketing Strategies",
    department: "Marketing Department",
    location: "Conference Room A, XYZ Hotel",
    updatedOn: "Mar 22, 2025",
    tags: ["Seminar", "Marketing"],
    price: 500,
    registrationDaysLeft: 5,
    description:
      "Learn effective digital marketing strategies from top professionals to boost your brand's online presence.",
    speakers: ["Ms. Emily Johnson"],
    meetingLink: "",
  },
  {
    id: 3,
    title: "Workshop: AI & Machine Learning Basics",
    department: "Artificial Intelligence",
    location: "Room 304, ABC University",
    updatedOn: "Mar 25, 2025",
    tags: ["Workshop", "AI", "Machine Learning"],
    price: 300,
    registrationDaysLeft: 7,
    description:
      "A hands-on workshop covering fundamental AI and ML concepts, led by industry professionals.",
    speakers: ["Dr. Robert Brown", "Dr. Lisa White"],
    meetingLink: "",
  },
  {
    id: 4,
    title: "Panel Discussion: Women in Tech",
    department: "Diversity & Inclusion",
    location: "Online",
    updatedOn: "Mar 28, 2025",
    tags: ["Panel", "Diversity"],
    price: 0,
    registrationDaysLeft: 15,
    description:
      "An inspiring discussion featuring successful women in tech, sharing their career journeys and insights.",
    speakers: ["Ms. Sarah Connor", "Dr. Emily Watson"],
    meetingLink: "https://meet.google.com/panel-tech",
  },
  {
    id: 5,
    title: "Conference: Cybersecurity Trends 2025",
    department: "Cybersecurity",
    location: "Grand Hall, Cyber Expo Center",
    updatedOn: "Apr 2, 2025",
    tags: ["Conference", "Cybersecurity"],
    price: 1200,
    registrationDaysLeft: 20,
    description:
      "Explore the latest trends, threats, and solutions in the cybersecurity landscape.",
    speakers: ["Mr. Alan Turing", "Dr. Susan Fields"],
    meetingLink: "",
  },
  {
    id: 6,
    title: "Training: Cloud Computing Essentials",
    department: "IT Training",
    location: "Tech Training Lab, DEF Corp",
    updatedOn: "Apr 5, 2025",
    tags: ["Training", "Cloud Computing"],
    price: 800,
    registrationDaysLeft: 25,
    description:
      "Comprehensive training on cloud platforms including AWS, Azure, and Google Cloud.",
    speakers: ["Mr. Kevin Parker"],
    meetingLink: "",
  },
  {
    id: 7,
    title: "Webinar: Blockchain for Beginners",
    department: "Blockchain Research",
    location: "Online",
    updatedOn: "Apr 8, 2025",
    tags: ["Webinar", "Blockchain"],
    price: 0,
    registrationDaysLeft: 30,
    description:
      "A beginner-friendly introduction to blockchain technology and its applications.",
    speakers: ["Dr. Hannah Green"],
    meetingLink: "https://meet.google.com/blockchain-intro",
  },
  {
    id: 8,
    title: "Hackathon: Code for a Cause",
    department: "Software Development",
    location: "Tech Hub, GHI Inc.",
    updatedOn: "Apr 12, 2025",
    tags: ["Hackathon", "Coding"],
    price: 0,
    registrationDaysLeft: 35,
    description:
      "A coding competition to solve real-world social issues using innovative tech solutions.",
    speakers: ["Mentors from Top Tech Companies"],
    meetingLink: "",
  },
  {
    id: 9,
    title: "Networking Event: Startup Connect",
    department: "Entrepreneurship",
    location: "Business Lounge, JKL Tower",
    updatedOn: "Apr 15, 2025",
    tags: ["Networking", "Startups"],
    price: 150,
    registrationDaysLeft: 40,
    description:
      "An opportunity for entrepreneurs, investors, and professionals to network and collaborate.",
    speakers: ["Top Startup Founders"],
    meetingLink: "",
  },
  {
    id: 10,
    title: "Masterclass: UX/UI Design Trends 2025",
    department: "Design & Innovation",
    location: "Creative Studio, MNO Design",
    updatedOn: "Apr 18, 2025",
    tags: ["Masterclass", "UX/UI"],
    price: 600,
    registrationDaysLeft: 45,
    description:
      "Learn the latest UX/UI design trends and best practices from industry-leading designers.",
    speakers: ["Ms. Olivia Turner"],
    meetingLink: "",
  },
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(eventsData[0]);

  // Function to handle payment / registration
  const handlePayment = () => {
    // If the event is free, simply show a success message.
    if (selectedEvent.price === 0) {
      alert("You have successfully registered for this free event!");
      return;
    }

    // Dynamically load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: "rzp_test_TEuqsRAqJY9qh2", // Replace with your Razorpay key
        amount: selectedEvent.price * 100, // Amount in paisa
        currency: "INR",
        name: "Event Registration",
        description: selectedEvent.title,
        image: "https://example.com/logo.png", // Optional: update with your logo URL
        prefill: {
          email: "user@example.com",
          contact: "1234567890",
        },
        handler: function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          // Add additional registration logic here (e.g., updating backend records)
        },
        modal: {
          ondismiss: function () {
            if (confirm("Are you sure you want to close the payment form?")) {
              console.log("Checkout form closed by the user");
            } else {
              console.log("Please complete the payment");
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  return (
    <div className="events-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Events</h2>
        <div className="events-list">
          {eventsData.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`event-item ${
                selectedEvent.id === event.id ? "selected" : ""
              }`}
            >
              <h3 className="event-title">{event.title}</h3>
              <p className="event-department">{event.department}</p>
              <p className="event-price">
                {event.price === 0 ? "Free" : `₹${event.price}`}
              </p>
              <div className="event-tags">
                {event.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="details-section">
        <div className="event-details">
          <h2 className="details-title">{selectedEvent.title}</h2>
          <p className="details-info">
            {selectedEvent.department} | {selectedEvent.location}
          </p>
          <div className="details-tags">
            {selectedEvent.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <p className="details-description">{selectedEvent.description}</p>
          <p className="details-speakers">
            <strong>Speaker(s):</strong> {selectedEvent.speakers.join(", ")}
          </p>

          {/* Registration Section */}
          <div className="registration-box">
            <p className="registration-price">
              {selectedEvent.price === 0 ? "Free" : `₹${selectedEvent.price}`}
            </p>
            <button className="register-button" onClick={handlePayment}>
              Register
            </button>
          </div>

          {/* Meeting Link (Only for Webinars) */}
          {selectedEvent.meetingLink && (
            <p className="meeting-link">
              <a
                href={selectedEvent.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Meeting
              </a>
            </p>
          )}

          {/* Registration Time Info */}
          <div className="time-info">
            <p>
              <strong>Time left:</strong> {selectedEvent.registrationDaysLeft}{" "}
              days left
            </p>
            <p>
              <strong>Date:</strong> {selectedEvent.updatedOn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
