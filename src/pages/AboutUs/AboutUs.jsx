import { ArrowLeft, Github, Linkedin, Mail } from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-500 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/" className="inline-flex items-center text-white hover:text-blue-300 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl font-semibold text-white max-w-3xl">Meet the team behind Eventify - 5Knights</p>
        </div>
      </div>

      {/* Project Introduction */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-[#1f2937]">COSC2769 - Fullstack Web Development</h1>
            <p className="text-lg text-gray-600 font-bold mb-8">
              Eventify is a comprehensive event management platform designed to simplify the process of creating,
              managing, and attending events. Our platform provides intuitive tools for event organizers and a seamless
              experience for attendees.
            </p>
            <div className="flex justify-center">
              <div className="bg-[#3b82f6] h-1 w-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Leader */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#1f2937]">Our team "<span className={"text-blue-500"}>5Knights</span>"</h2>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-full w-full relative">
                    <img
                      src={teamLeader.avatar || "/placeholder.svg"}
                      alt={teamLeader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-8 font-semibold">
                  <div className="inline-block bg-[#3b82f6] text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    Team Leader
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{teamLeader.name}</h3>
                  <p className="text-[#6b7280] mb-2">SID: {teamLeader.sid}</p>
                  <p className="text-[#3b82f6] font-medium mb-4">{teamLeader.role}</p>
                  <p className="text-gray-600 mb-6">{teamLeader.bio}</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-500 hover:text-[#3b82f6]">
                      <Github className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-[#3b82f6]">
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-[#3b82f6]">
                      <Mail className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 font-semibold"
              >

                <div className="w-full h-70 relative">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                  <p className="text-[#6b7280] text-center mb-2">sID: {member.sid}</p>
                  {/*<div className="flex justify-center space-x-3">*/}
                  {/*  <a href="#" className="text-gray-500 hover:text-[#3b82f6]">*/}
                  {/*    <Github className="h-5 w-5" />*/}
                  {/*  </a>*/}
                  {/*  <a href="#" className="text-gray-500 hover:text-[#3b82f6]">*/}
                  {/*    <Linkedin className="h-5 w-5" />*/}
                  {/*  </a>*/}
                  {/*  <a href="#" className="text-gray-500 hover:text-[#3b82f6]">*/}
                  {/*    <Mail className="h-5 w-5" />*/}
                  {/*  </a>*/}
                  {/*</div>*/}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Message to Marker and Lecturer */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg border border-[#e5e7eb]">
            <h2 className="text-2xl font-bold mb-6 text-[#1f2937]">Message to Our Marker and Lecturer</h2>
            <div className="prose max-w-none text-[#6b7280] font-semibold">
              <p className="mb-4">Dear Marker and Lecturer,</p>
              <p className="mb-4">
                We would like to express our sincere gratitude for your guidance and support throughout this project.
                Eventify represents our collective effort to create a solution that addresses real-world challenges in
                event management.
              </p>
              <p className="mb-4">
                Throughout the development process, we've applied the concepts and techniques learned in our coursework,
                while also exploring new technologies and methodologies. Each team member has contributed their unique
                skills and perspectives, resulting in a project we're proud to present.
              </p>
              <p className="mb-4">
                We appreciate your time in reviewing our work and welcome any feedback that will help us grow as
                developers and as a team.
              </p>
              <p className="font-medium">
                Sincerely,
                <br />
                The 5Knights Team
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Team leader data
const teamLeader = {
  name: "Khong Quoc Khanh",
  sid: "4021494",
  role: "Project Manager & Team Leader",
  bio: "As the team leader, I coordinated our project development, managed timelines, and ensured effective communication between team members. I also contributed to frontend development and overall system architecture.",
  avatar: "/member/components.png", // Replace with your actual image path
}

// Team members data (excluding the leader)
const teamMembers = [

  {
    name: "Luong Chi Bach",
    sid: "4029308",
    role: "UI/UX Designer",
    avatar: "/member/bach.jpg", // Replace with actual image path
  },
  {
    name: "Dao Duc Lam",
    sid: "4019052",
    role: "Backend Developer",
    avatar: "/member/lam.jpg" // Replace with actual image path
  },
  {
    name: "Tran Dinh Hai",
    sid: "45678901",
    role: "Database Administrator",
    avatar: "/member/hai.jpg", // Replace with actual image path
  },
  {
    name: "Duong Bao Ngoc",
    sid: "56789012",
    role: "QA & Testing Engineer",
    avatar: "/member/ngoc.jpg", // Replace with actual image path
  },
]
