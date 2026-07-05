import 'dotenv/config'
import { pool } from '../db.js'

interface DoctorSeed {
  id: string
  name: string
  specialization: string
  experienceYears: number
  rating: number
  reviewCount: number
  location: string
  consultationFee: number
  bio: string
  education: string[]
  languages: string[]
}

const doctors: DoctorSeed[] = [
  {
    id: 'doc-1',
    name: 'Dr. Aisha Khan',
    specialization: 'Cardiology',
    experienceYears: 14,
    rating: 4.8,
    reviewCount: 312,
    location: 'Lakeside Medical Center, Suite 210',
    consultationFee: 120,
    bio: 'Dr. Khan is a board-certified cardiologist specializing in preventive heart care, echocardiography, and management of hypertension. She takes a patient-first approach, focusing on lifestyle-based interventions alongside modern treatment.',
    education: ['MD, Johns Hopkins University', 'Fellowship in Cardiology, Mayo Clinic'],
    languages: ['English', 'Urdu', 'Hindi'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Reyes',
    specialization: 'Dermatology',
    experienceYears: 9,
    rating: 4.6,
    reviewCount: 187,
    location: 'Clearview Skin Clinic',
    consultationFee: 90,
    bio: 'Dr. Reyes treats a wide range of skin conditions including acne, eczema, and psoriasis, and performs cosmetic dermatology procedures. He is passionate about accessible skincare education.',
    education: ['MD, University of California, San Francisco', 'Residency in Dermatology, NYU'],
    languages: ['English', 'Spanish'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Nair',
    specialization: 'Pediatrics',
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 402,
    location: "Sunshine Children's Hospital",
    consultationFee: 80,
    bio: 'Dr. Nair has spent over a decade caring for children from infancy through adolescence, with special interest in developmental pediatrics and childhood immunization.',
    education: ['MD, University of Toronto', 'Residency in Pediatrics, SickKids Hospital'],
    languages: ['English', 'Malayalam', 'Tamil'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Elena Novak',
    specialization: 'Neurology',
    experienceYears: 17,
    rating: 4.7,
    reviewCount: 256,
    location: 'Riverbend Neurology Institute',
    consultationFee: 150,
    bio: 'Dr. Novak specializes in the diagnosis and treatment of migraines, epilepsy, and neurodegenerative disorders. She combines clinical research with compassionate, individualized care.',
    education: ['MD, PhD, Charles University', 'Fellowship in Neurology, Cleveland Clinic'],
    languages: ['English', 'Czech', 'German'],
  },
  {
    id: 'doc-5',
    name: 'Dr. James Okafor',
    specialization: 'Orthopedics',
    experienceYears: 13,
    rating: 4.5,
    reviewCount: 198,
    location: 'Summit Orthopedic & Sports Medicine',
    consultationFee: 110,
    bio: 'Dr. Okafor focuses on sports injuries, joint replacement, and minimally invasive orthopedic surgery, helping patients of all activity levels return to pain-free movement.',
    education: ['MD, University of Michigan', 'Fellowship in Sports Medicine, Duke University'],
    languages: ['English', 'French'],
  },
  {
    id: 'doc-6',
    name: 'Dr. Sofia Martinez',
    specialization: 'Dentistry',
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 274,
    location: 'Bright Smile Dental Studio',
    consultationFee: 70,
    bio: 'Dr. Martinez provides comprehensive dental care including preventive checkups, cosmetic dentistry, and restorative treatments in a calm, patient-friendly environment.',
    education: ['DDS, University of Southern California'],
    languages: ['English', 'Spanish', 'Portuguese'],
  },
  {
    id: 'doc-7',
    name: 'Dr. Daniel Whitfield',
    specialization: 'General Medicine',
    experienceYears: 20,
    rating: 4.6,
    reviewCount: 521,
    location: 'Downtown Family Practice',
    consultationFee: 60,
    bio: 'Dr. Whitfield is a family medicine physician offering comprehensive primary care for patients of all ages, from routine checkups to chronic disease management.',
    education: ['MD, University of Edinburgh'],
    languages: ['English'],
  },
  {
    id: 'doc-8',
    name: 'Dr. Hannah Lindqvist',
    specialization: 'Psychiatry',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 233,
    location: 'Calm Mind Behavioral Health',
    consultationFee: 130,
    bio: 'Dr. Lindqvist provides evidence-based psychiatric care for anxiety, depression, and mood disorders, integrating therapy and medication management tailored to each patient.',
    education: ['MD, Karolinska Institute', 'Residency in Psychiatry, Massachusetts General Hospital'],
    languages: ['English', 'Swedish'],
  },
  {
    id: 'doc-9',
    name: 'Dr. Ravi Chandran',
    specialization: 'Ophthalmology',
    experienceYears: 15,
    rating: 4.7,
    reviewCount: 289,
    location: 'ClearVision Eye Center',
    consultationFee: 100,
    bio: 'Dr. Chandran specializes in cataract surgery, glaucoma management, and comprehensive eye exams, helping patients preserve and improve their vision.',
    education: ['MBBS, All India Institute of Medical Sciences', 'Fellowship in Ophthalmology, Moorfields Eye Hospital'],
    languages: ['English', 'Hindi', 'Tamil'],
  },
  {
    id: 'doc-10',
    name: 'Dr. Grace Adeyemi',
    specialization: 'Gynecology',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 356,
    location: "Willow Women's Health Clinic",
    consultationFee: 115,
    bio: 'Dr. Adeyemi offers compassionate obstetric and gynecological care, including prenatal care, family planning, and minimally invasive gynecologic surgery.',
    education: ['MD, University of Lagos', 'Residency in OB/GYN, Columbia University'],
    languages: ['English', 'Yoruba'],
  },
]

async function main() {
  for (const doctor of doctors) {
    await pool.query(
      `INSERT INTO doctors (id, name, specialization, experience_years, rating, review_count, location, consultation_fee, bio, education, languages)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         specialization = EXCLUDED.specialization,
         experience_years = EXCLUDED.experience_years,
         rating = EXCLUDED.rating,
         review_count = EXCLUDED.review_count,
         location = EXCLUDED.location,
         consultation_fee = EXCLUDED.consultation_fee,
         bio = EXCLUDED.bio,
         education = EXCLUDED.education,
         languages = EXCLUDED.languages`,
      [
        doctor.id,
        doctor.name,
        doctor.specialization,
        doctor.experienceYears,
        doctor.rating,
        doctor.reviewCount,
        doctor.location,
        doctor.consultationFee,
        doctor.bio,
        doctor.education,
        doctor.languages,
      ],
    )
  }
  console.log(`Seeded ${doctors.length} doctors.`)
  await pool.end()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
