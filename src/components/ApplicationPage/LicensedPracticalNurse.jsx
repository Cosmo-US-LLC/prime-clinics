import React from "react";
import Modal from "../ui/Modal";

const responsibilities = [
  {
    title: "Patient Consultation & Assessment",
    items: [
      "Conduct comprehensive consultations, assessing client needs, goals, and medical history to design personalized treatment plans.",
      "Educate clients on treatment options, expected results, and appropriate post-treatment care.",
      "Recommend home maintenance protocols.",
    ],
  },
  {
    title: "Performance and Wellness Treatments",
    items: [
      "Diagnostics: DXA, MVO2, BMR, Biomarker Testing",
      "Injections: Dermal Fillers (face and erectile), Neuromodulators, PRP (hair restoration, joints), IV Drip, Booster Shots",
      "BTL Devices: Emculpt, Emsella, Exomind",
    ],
  },
  {
    title: "Patient Education & Follow-Up",
    items: [
      "Provide detailed post-treatment instructions and guide clients on best practices for recovery and maintenance.",
      "Schedule and conduct follow-up appointments to assess outcomes and address any questions or concerns.",
      "Offer recommendations or requisitions for additional treatments or products to support long-term results and wellness.",
    ],
  },
  {
    title: "Clinical Documentation & Compliance",
    items: [
      "Accurately document patient records, including medical history, treatment details, and progress notes.",
      "Maintain adherence to all regulatory standards, clinic policies, and safety protocols.",
      "Stay current with best practices and advancements in men's health, aesthetics, and injection techniques.",
    ],
  },
  {
    title: "Collaboration & Team Support",
    items: [
      "Work closely with other clinic professionals to provide coordinated and comprehensive care.",
      "Participate in ongoing training, quality improvement initiatives, and team meetings.",
      "Contribute to a positive, patient-centered clinic culture that prioritizes high standards of care.",
    ],
  },
];

const qualificationsAndBenefits = [
  {
    title: "Qualifications",
    items: [
      "Licensed: Licensed Practical Nurse (LPN) license and certification for province with prescriptive authority.",
      "Experience: Minimum of 1–2 years of experience in cosmetic injections.",
      "Skills: Strong clinical assessment skills, and a commitment to patient safety and satisfaction.",
      "Personality: Interest in Health and Wellness, professional, and skilled at building trust and rapport with patients.",
    ],
  },
  {
    title: "Benefits",
    items: [
      "Competitive wage with performance-based incentives.",
      "Ongoing professional development and training in new treatments.",
      "Employee discounts on treatments and products.",
      "Supportive, collaborative work environment focused on excellence in patient care.",
    ],
  },
];

const jobMeta = [
  {
    label: "Position Title",
    value: "Licensed Practical Nurse (LPN)",
  },
  {
    label: "Reports To",
    value: "Clinic Lead and Medical Director",
  },
  {
    label: "Job Type",
    value: "Part-time with opportunity to Full-Time",
  },
  {
    label: "Job Posted",
    value: "20/12/2025",
  },
  {
    label: "Work Experience",
    value: "5–7 Years",
  },
  {
    label: "Location",
    value: "On-site at a PRIME Clinic",
  },
];

const LicensedPracticalNurseModal = ({
  showLpnModal,
  setShowLpnModal,
  onSelectPosition,
}) => {
  return (
    <Modal
      isOpen={showLpnModal} 
      onClose={() => setShowLpnModal(false)}
      title="Licensed Practical Nurse (LPN)"
    >
      <div className=" flex md:flex-row-reverse flex-col gap-[20px] ">
        <div className="">
          <div className="space-y-[14px] md:py-[24px] md:bg-[#E9F0FF] rounded-lg md:px-[20px]">
          <h4 className="md:text-[32px] text-[25px] font-bold text-[#101828]">
            Job Information
          </h4>
          <div className="space-y-6">
            {jobMeta.map((item, index) => (
              <div key={index}>
                <p className="text-[14px] text-[#4A5565]">{item.label}</p>
                <p className="text-[14px] font-semibold text-[#373737]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          </div>
            <button
              onClick={() => {
                onSelectPosition("licensed_practical_nurse");
                setShowLpnModal(false);
              }}
              className="bg-[#155DFC] text-white py-2 px-4 rounded-lg block mt-[18px] w-full max-md:hidden"
            >
              Apply Now
            </button>
        </div>
        <div className="flex-1 space-y-[28px]">
          <div className="space-y-2">
            <h4 className="md:text-[24px] text-[22px] font-bold text-[#101828]">
              About Prime Clinics
            </h4>
            <p className="text-[#364153] md:text-[14px] text-[13px]">
              Prime Clinics is a Performance and Longevity clinic specializing
              in a comprehensive range of treatments to enhance to optimize
              health and fitness. Prime Clinics empowers you to take your
              performance, strength, vitality, longevity, and confidence to the
              next level—enhancing movement, quality of life, and helping you
              live your best life. Our advanced diagnostic testing is supported
              with science backed health optimization solutions and
              best-in-class technology to fine-tune your mind and body for peak
              performance.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="md:text-[24px] text-[22px] font-bold text-[#101828]">Location</h4>
            <p className="text-[#364153] md:text-[14px] text-[13px]">
              PRIME Clinics has established a relationship with Evolve Strength
              Gyms, the first location within Evolve at South Edmonton Common
              (old Nordstrom Rack building). Scheduled Opening Date May 1, 2026.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="md:text-[24px] text-[22px] font-bold text-[#101828]">
              Job Summary
            </h4>
            <p className="text-[#364153] md:text-[14px] text-[13px]">
              Your role will involve conducting diagnostic assessments and
              recommending individualized treatment pathways. You will also
              perform a variety of treatments, including cosmetic injections
              (dermal fillers and neurotoxins), IV drips and Performance Booster
              shots, PRP for hair restoration and erectile rejuvenation, as well
              as the use of electromagnetic stimulation devices.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="md:text-[24px] text-[22px] font-bold text-[#101828]">Key Responsibilities</h4>
            <p className="text-[#364153] md:text-[14px] text-[13px]">
              As this is a new company, the roles and responsibilities will be
              adjusted to the needs of the company, staff, and patients.
            </p>
            <div className="space-y-4">
              {responsibilities.map((section, index) => (
                <div key={index}>
                  <p className="text-[#364153] md:text-[14px] text-[13px] font-semibold">
                    {section.title}
                  </p>

                  <ul className="list-disc list-inside text-[#364153] mt-1 space-y-1">
                    {section.items.map((item, idx) => (
                      <li className="text-[#364153] md:text-[14px] text-[13px]" key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {qualificationsAndBenefits.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="md:text-[24px] text-[22px] font-bold text-[#101828]">
                    {section.title}
                  </h4>

                  <ul className="list-disc list-inside text-[#364153] mt-1 space-y-1">
                    {section.items.map((item, idx) => (
                      <li className="text-[#364153] md:text-[14px] text-[13px]" key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="md:text-[24px] text-[22px] font-bold text-[#101828]">
                How to Apply
              </h4>
              <p className="text-[#364153] md:text-[14px] text-[13px]">
                If you are a skilled Licensed Practical Nurse – Cosmetic
                Injector with a passion for optimized health and aesthetic
                medicine, we invite you to join our team at Prime Clinics and
                help our clients achieve their performance and longevity goals.
              </p>
              <p className="text-[#364153] md:text-[14px] text-[13px]">
                Please submit your resume and cover letter detailing your
                relevant experience, and qualifications.
              </p>
              <p className="text-[#364153] md:text-[14px] text-[13px] ">
                For inquiries email{" "}
                <a
                  href="mailto:lina@primeclinics.ca"
                  className="text-[#155DFC] underline hover:opacity-80 transition"
                >
                  lina@primeclinics.ca
                </a>?
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                onSelectPosition("licensed_practical_nurse");
                setShowLpnModal(false);
              }}
              className="bg-[#155DFC] text-white py-2 px-4 rounded-lg"
            >
              Apply Now
            </button>
            <button
              onClick={() => setShowLpnModal(false)}
              className="py-2 px-4 rounded-lg border"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LicensedPracticalNurseModal;
