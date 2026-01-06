import { kv } from '@vercel/kv';
import { QUESTION_KEY, ALL_QUESTIONS_KEY } from '../../lib/kv.js';

/**
 * ONE-TIME SETUP ENDPOINT - 100 QUESTIONS
 * Run this ONCE to populate 100 questions in Vercel KV
 * 
 * Usage:
 * 1. Deploy this file to Vercel
 * 2. Set ADMIN_SECRET environment variable in Vercel dashboard
 * 3. Visit: https://rajinikanth.ai/api/admin/seed-questions?secret=YOUR_SECRET
 * 4. DELETE this file after successful seeding for security
 */

const QUESTIONS = [
    // ========== ORIGINAL 30 QUESTIONS ==========
    {
        id: 1,
        question: "In which year did Rajinikanth make his acting debut?",
        options: ["1973", "1975", "1977", "1979"],
        correctAnswer: 1,
        funFact: "Rajinikanth made his debut in 1975 with the film 'Apoorva Raagangal' directed by K. Balachander, playing an antagonist role.",
        category: "Career",
        difficulty: "easy"
    },
    {
        id: 2,
        question: "What was Rajinikanth's character name in the movie Baashha?",
        options: ["Manickam", "Muthu", "Surya", "Kaali"],
        correctAnswer: 0,
        funFact: "In Baashha (1995), Rajini played Manickam, an auto driver who was once a feared Mumbai don. The film became one of his most iconic roles!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 3,
        question: "Which Rajinikanth film became a massive hit in Japan?",
        options: ["Sivaji", "Baashha", "Muthu", "Padayappa"],
        correctAnswer: 2,
        funFact: "Muthu (1995) earned over $1.6 million in Japan, making Rajini a superstar there! He's called 'The Dancing Maharaja' in Japan.",
        category: "International",
        difficulty: "medium"
    },
    {
        id: 4,
        question: "In Enthiran, what is the robot's name?",
        options: ["Robo", "Chitti", "Vasi", "Andro"],
        correctAnswer: 1,
        funFact: "Chitti, the intelligent robot, became one of cinema's most memorable AI characters. Enthiran was India's most expensive film at release (₹132 crore)!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 5,
        question: "Which prestigious award did Rajinikanth receive in 2016?",
        options: ["Padma Shri", "Padma Bhushan", "Padma Vibhushan", "Bharat Ratna"],
        correctAnswer: 2,
        funFact: "Rajinikanth was awarded the Padma Vibhushan, India's second-highest civilian honor, for his contributions to the arts.",
        category: "Awards",
        difficulty: "medium"
    },
    {
        id: 6,
        question: "How many films did Rajinikanth act in during 1977?",
        options: ["5", "10", "15", "20"],
        correctAnswer: 2,
        funFact: "In just 1977, Rajini acted in an incredible 15 films! This record-breaking year established him as a rising star in Tamil cinema.",
        category: "Career",
        difficulty: "hard"
    },
    {
        id: 7,
        question: "Which film marked Rajinikanth's 100th movie?",
        options: ["Baashha", "Muthu", "Sri Raghavendra", "Annamalai"],
        correctAnswer: 2,
        funFact: "Sri Raghavendra (1985) was Rajini's milestone 100th film, where he played the Hindu saint Raghavendra Swami.",
        category: "Milestones",
        difficulty: "hard"
    },
    {
        id: 8,
        question: "What was Rajinikanth's profession before becoming an actor?",
        options: ["Teacher", "Bus Conductor", "Mechanic", "Waiter"],
        correctAnswer: 1,
        funFact: "Before stardom, Rajini worked as a bus conductor in Bangalore. His rags-to-riches story is truly inspiring!",
        category: "Biography",
        difficulty: "easy"
    },
    {
        id: 9,
        question: "Which 1999 film featured the famous dialogue 'En vazhi, thani vazhi'?",
        options: ["Baashha", "Padayappa", "Muthu", "Arunachalam"],
        correctAnswer: 1,
        funFact: "Padayappa (1999) became a cultural phenomenon! The film ran for over a year in theaters and made 'En vazhi, thani vazhi' an iconic line.",
        category: "Dialogues",
        difficulty: "easy"
    },
    {
        id: 10,
        question: "What is Rajinikanth's real name?",
        options: ["Shivaji Rao Gaekwad", "Rajendra Kumar", "Sivaji Ganesan", "Ravi Chandran"],
        correctAnswer: 0,
        funFact: "Born as Shivaji Rao Gaekwad, he adopted the screen name 'Rajinikanth' on the advice of director K. Balachander.",
        category: "Biography",
        difficulty: "medium"
    },
    {
        id: 11,
        question: "Which film featured Rajinikanth in a negative role early in his career?",
        options: ["16 Vayathinile", "Mullum Malarum", "Bhuvana Oru Kelvi Kuri", "Moondru Mudichu"],
        correctAnswer: 0,
        funFact: "In 16 Vayathinile (1977), Rajini played the villain Parattai. This role showcased his versatility and established him as a powerful actor.",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 12,
        question: "Which was Rajinikanth's first film to cross ₹100 crore?",
        options: ["Enthiran", "Sivaji", "Chandramukhi", "Padayappa"],
        correctAnswer: 1,
        funFact: "Sivaji: The Boss (2007) was Rajini's first ₹100 crore film and became the highest-grossing Tamil film at that time!",
        category: "Box Office",
        difficulty: "medium"
    },
    {
        id: 13,
        question: "Who directed Rajinikanth's debut film?",
        options: ["Bharathiraja", "K. Balachander", "Mani Ratnam", "Shankar"],
        correctAnswer: 1,
        funFact: "K. Balachander, a legendary Tamil director, launched Rajini's career and directed him in multiple films. Rajini considers him his mentor.",
        category: "Directors",
        difficulty: "medium"
    },
    {
        id: 14,
        question: "In which year was Baashha released?",
        options: ["1993", "1995", "1997", "1999"],
        correctAnswer: 1,
        funFact: "Baashha released on January 12, 1995, and became a blockbuster. It's considered one of Tamil cinema's greatest mass entertainers!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 15,
        question: "Which film featured Rajini's first motion capture performance?",
        options: ["Enthiran", "2.0", "Kochadaiiyaan", "Lingaa"],
        correctAnswer: 2,
        funFact: "Kochadaiiyaan (2014) was India's first photorealistic motion capture film, with Rajini's performance digitally captured for the animated avatar.",
        category: "Innovation",
        difficulty: "medium"
    },
    {
        id: 16,
        question: "How long did Chandramukhi run in theaters?",
        options: ["365 days", "500 days", "700 days", "890 days"],
        correctAnswer: 3,
        funFact: "Chandramukhi (2005) had an unprecedented 890-day run at Chennai's Shanti theatre, setting a record that stood for years!",
        category: "Box Office",
        difficulty: "hard"
    },
    {
        id: 17,
        question: "Which Rajinikanth film was directed by Shankar?",
        options: ["Annamalai", "Sivaji", "Baashha", "Arunachalam"],
        correctAnswer: 1,
        funFact: "Director Shankar collaborated with Rajini on Sivaji (2007), Enthiran (2010), and 2.0 (2018), creating some of Tamil cinema's biggest spectacles!",
        category: "Directors",
        difficulty: "easy"
    },
    {
        id: 18,
        question: "What was Rajinikanth's character profession in Muthu?",
        options: ["Auto driver", "Bus driver", "Servant", "Mechanic"],
        correctAnswer: 2,
        funFact: "In Muthu, Rajini played a loyal servant who dreams of becoming a king. The film's success in Japan made him a phenomenon there!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 19,
        question: "Which actress played the lead role opposite Rajini in Padayappa?",
        options: ["Simran", "Ramya Krishnan", "Soundarya", "Meena"],
        correctAnswer: 2,
        funFact: "Soundarya played the female lead, while Ramya Krishnan's portrayal of the antagonist Neelambari became iconic!",
        category: "Co-stars",
        difficulty: "medium"
    },
    {
        id: 20,
        question: "What is the famous opening line of Baashha?",
        options: ["Naan oru thadava sonna", "En vazhi thani vazhi", "Naan epdi irukannu", "Mind it"],
        correctAnswer: 0,
        funFact: "'Naan oru thadava sonna, nooru thadava sonna madhiri' became one of Indian cinema's most iconic dialogues!",
        category: "Dialogues",
        difficulty: "easy"
    },
    {
        id: 21,
        question: "Who gave Rajinikanth the title 'Superstar'?",
        options: ["K. Balachander", "Kalaipuli S. Thanu", "Bharathiraja", "J. Mahendran"],
        correctAnswer: 1,
        funFact: "Kalaipuli S Thanu promoted the 'Superstar' title for Rajinikanth's superhit movie Billa.",
        category: "Career",
        difficulty: "hard"
    },
    {
        id: 22,
        question: "In which decade did Rajinikanth gain the title 'Thalaivar'?",
        options: ["1970s", "1980s", "1990s", "2000s"],
        correctAnswer: 2,
        funFact: "The title 'Thalaivar' (The Boss/Leader) became widely used in the 1990s after a series of blockbuster hits established his unparalleled stardom.",
        category: "Legacy",
        difficulty: "medium"
    },
    {
        id: 23,
        question: "Which Rajinikanth film featured a double role of father and son?",
        options: ["Thalapathi", "Annamalai", "Baba", "Netrikkan"],
        correctAnswer: 3,
        funFact: "In Netrikkan, Rajini played a middle-aged businessman Chakravarthy and his son Santhosh, who tried to mend his father.",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 24,
        question: "What was the budget of 2.0?",
        options: ["₹400 crore", "₹500 crore", "₹543 crore", "₹600 crore"],
        correctAnswer: 2,
        funFact: "2.0 (2018) was made with a budget of ₹543 crore, making it the most expensive Indian film at the time of release!",
        category: "Box Office",
        difficulty: "hard"
    },
    {
        id: 25,
        question: "Which film marked Rajinikanth's comeback after a brief hiatus in the early 2000s?",
        options: ["Chandramukhi", "Baba", "Sivaji", "Kuselan"],
        correctAnswer: 0,
        funFact: "After Baba's underwhelming performance, Chandramukhi (2005) marked Rajini's grand comeback and became a massive blockbuster!",
        category: "Career",
        difficulty: "medium"
    },
    {
        id: 26,
        question: "In which language was Rajinikanth's film 'Bloodstone' made?",
        options: ["Tamil", "Hindi", "English", "Telugu"],
        correctAnswer: 2,
        funFact: "Bloodstone (1988) was an English-language action film where Rajini acted alongside international cast members. It's one of his rare non-Indian films.",
        category: "Films",
        difficulty: "hard"
    },
    {
        id: 27,
        question: "Which 2019 film saw Rajinikanth collaborate with director Karthik Subbaraj?",
        options: ["Darbar", "Petta", "Annaatthe", "Jailer"],
        correctAnswer: 1,
        funFact: "Petta (2019) was a mass entertainer that brought back Rajini's vintage 'Kaali' avatar, delighting fans worldwide!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 28,
        question: "What is Rajinikanth's signature gesture called?",
        options: ["The Flip", "The Toss", "The Rajini Style", "The Swag"],
        correctAnswer: 2,
        funFact: "The 'Rajini Style' includes his signature cigarette flip, sunglasses toss, and unique way of wearing sunglasses. It's been imitated worldwide!",
        category: "Style",
        difficulty: "easy"
    },
    {
        id: 29,
        question: "Which film featured the song 'Oruvan Oruvan Mudhalali'?",
        options: ["Muthu", "Baashha", "Padayappa", "Annamalai"],
        correctAnswer: 0,
        funFact: "This iconic song from Muthu became a chartbuster in India and Japan! The dance moves are still popular today.",
        category: "Music",
        difficulty: "easy"
    },
    {
        id: 30,
        question: "How many languages has Rajinikanth acted in?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 2,
        funFact: "Rajini has acted in 6 languages: Tamil, Telugu, Kannada, Malayalam, Hindi, and English - showcasing his pan-Indian appeal!",
        category: "Career",
        difficulty: "medium"
    },
    
    // ========== NEW 70 QUESTIONS (31-100) ==========
    
    {
        id: 31,
        question: "Which composer created music for most of Rajinikanth's hit films in the 1990s?",
        options: ["Ilaiyaraaja", "A.R. Rahman", "Deva", "Vidyasagar"],
        correctAnswer: 2,
        funFact: "Deva composed music for numerous Rajini blockbusters including Baashha, Muthu, and Arunachalam in the 1990s!",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 32,
        question: "In which city was Rajinikanth born?",
        options: ["Chennai", "Bangalore", "Mumbai", "Pune"],
        correctAnswer: 1,
        funFact: "Rajinikanth was born in Bangalore (now Bengaluru) on December 12, 1950, in a Marathi family.",
        category: "Biography",
        difficulty: "easy"
    },
    {
        id: 33,
        question: "Which film featured Rajinikanth as a coolie?",
        options: ["Mullum Malarum", "Velaikaran", "Thalapathi", "Coolie"],
        correctAnswer: 3,
        funFact: "The latest film 'Coolie' (2025) directed by Lokesh Kanagaraj marks Rajini's 50th year in cinema!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 34,
        question: "Which actress made her debut opposite Rajinikanth in 16 Vayathinile?",
        options: ["Sridevi", "Simran", "Meena", "Kushboo"],
        correctAnswer: 0,
        funFact: "Sridevi played the lead role in 16 Vayathinile (1977), which was also a breakthrough film for her career!",
        category: "Co-stars",
        difficulty: "medium"
    },
    {
        id: 35,
        question: "In Thalapathi, Rajinikanth's character is based on which Mahabharata figure?",
        options: ["Arjuna", "Karna", "Duryodhana", "Bhishma"],
        correctAnswer: 1,
        funFact: "Thalapathi (1991) is loosely based on the friendship between Karna and Duryodhana from the Mahabharata, with Mani Ratnam's direction.",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 36,
        question: "Which was the first Rajinikanth film to be released in 3D?",
        options: ["Enthiran", "Kochadaiiyaan", "2.0", "Lingaa"],
        correctAnswer: 1,
        funFact: "Kochadaiiyaan (2014) was released in 3D, making it India's first motion capture film and first 3D Rajini film!",
        category: "Innovation",
        difficulty: "medium"
    },
    {
        id: 37,
        question: "How many times did Rajinikanth work with director S.P. Muthuraman?",
        options: ["10", "15", "20", "25"],
        correctAnswer: 3,
        funFact: "S.P. Muthuraman directed Rajinikanth in 25 films, making him the director who worked with Rajini the most!",
        category: "Directors",
        difficulty: "hard"
    },
    {
        id: 38,
        question: "Which film had Rajinikanth playing a character named 'Surya'?",
        options: ["Thalapathi", "Billa", "Veera", "Annamalai"],
        correctAnswer: 0,
        funFact: "In Thalapathi (1991), Rajini played Surya, an orphan who becomes a loyal friend to a crime boss, in Mani Ratnam's masterpiece.",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 39,
        question: "Which Rajinikanth film was a remake of the Marathi film 'Ashi Hi Banwa Banwi'?",
        options: ["Thillu Mullu", "Veera", "Mannan", "Ejamaan"],
        correctAnswer: 0,
        funFact: "Thillu Mullu (1981) was inspired by the Hindi film Gol Maal, which itself was based on the Marathi film!",
        category: "Films",
        difficulty: "hard"
    },
    {
        id: 40,
        question: "What was Rajinikanth's character name in Sivaji?",
        options: ["Sivaji", "Vaseegaran", "Arunachalam", "Muthu"],
        correctAnswer: 0,
        funFact: "In Sivaji: The Boss (2007), Rajini played Sivaji Arumugam, a software systems architect fighting corruption!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 41,
        question: "Which film featured Rajinikanth as auto-rickshaw driver?",
        options: ["Baashha", "Padayappa", "Arunachalam", "Uzhaippali"],
        correctAnswer: 0,
        funFact: "In Baashha (1995), Rajini's character Manickam was an auto-rickshaw driver, though he was once a powerful don in Mumbai!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 42,
        question: "Who composed the music for Thalapathi?",
        options: ["Ilaiyaraaja", "A.R. Rahman", "M.S. Viswanathan", "Deva"],
        correctAnswer: 0,
        funFact: "Ilaiyaraaja's music for Thalapathi (1991) is considered one of his finest works, perfectly complementing Mani Ratnam's vision!",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 43,
        question: "In which year did Rajinikanth receive the Kalaimamani award?",
        options: ["1984", "1988", "1992", "1996"],
        correctAnswer: 0,
        funFact: "Rajinikanth received the Kalaimamani award from the Government of Tamil Nadu in 1984 for his excellence in cinema!",
        category: "Awards",
        difficulty: "hard"
    },
    {
        id: 44,
        question: "Which film marked Rajinikanth's first collaboration with director Bharathiraja?",
        options: ["16 Vayathinile", "Mullum Malarum", "Kodi Parakuthu", "Vedham Pudhithu"],
        correctAnswer: 0,
        funFact: "16 Vayathinile (1977) was Rajini's first film with Bharathiraja, where he played the memorable villain Parattai!",
        category: "Directors",
        difficulty: "medium"
    },
    {
        id: 45,
        question: "What was the original title of the film later known as 'Padayappa'?",
        options: ["Naattamai", "Mannan", "Same title", "Simmarasi"],
        correctAnswer: 2,
        funFact: "Padayappa was the original and final title of the 1999 blockbuster directed by K.S. Ravikumar!",
        category: "Films",
        difficulty: "hard"
    },
    {
        id: 46,
        question: "Which Rajinikanth film featured him in a triple role?",
        options: ["Moondru Mugam", "John Jani Janardhan", "Both A and B", "Neither"],
        correctAnswer: 2,
        funFact: "Moondru Mugam (1982) featured Rajini in a triple role, and it was remade in Hindi as John Jani Janardhan (1984)!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 47,
        question: "Who played the antagonist Neelambari in Padayappa?",
        options: ["Simran", "Ramya Krishnan", "Soundarya", "Meena"],
        correctAnswer: 1,
        funFact: "Ramya Krishnan's portrayal of the powerful antagonist Neelambari in Padayappa (1999) is considered one of Tamil cinema's best villain performances!",
        category: "Co-stars",
        difficulty: "easy"
    },
    {
        id: 48,
        question: "Which film had the tagline 'Oruvan Oruvan Muthalali'?",
        options: ["Muthu", "Ejamaan", "Annamalai", "Baashha"],
        correctAnswer: 0,
        funFact: "Muthu (1995) featured this famous song that became a massive hit and helped establish Rajini's popularity in Japan!",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 49,
        question: "In which film did Rajinikanth play a character named Vettaiyan?",
        options: ["Chandramukhi", "Vettaiyan", "Kuselan", "Jailer"],
        correctAnswer: 0,
        funFact: "In Chandramukhi (2005), Rajini played Dr. Vettaiyan Raja, a psychiatrist investigating supernatural events!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 50,
        question: "Which year did Rajinikanth receive his first Filmfare Award for Best Actor?",
        options: ["1982", "1984", "1986", "1988"],
        correctAnswer: 1,
        funFact: "Rajinikanth won the Filmfare Award for Best Actor - Tamil for Nallavanuku Nallavan in 1984!",
        category: "Awards",
        difficulty: "hard"
    },
    {
        id: 51,
        question: "Which film featured the iconic dialogue 'Ketta payyan sir intha Kaali'?",
        options: ["Mullum Malarum", "Petta", "Both A and B", "Thalapathi"],
        correctAnswer: 0,
        funFact: "This dialogue from Mullum Malarum (1978) established Rajini's mass appeal and was referenced again in Petta (2019)!",
        category: "Dialogues",
        difficulty: "medium"
    },
    {
        id: 52,
        question: "Who directed the film Enthiran?",
        options: ["Mani Ratnam", "Shankar", "A.R. Murugadoss", "Lokesh Kanagaraj"],
        correctAnswer: 1,
        funFact: "S. Shankar directed Enthiran (2010), creating a landmark science fiction film in Indian cinema!",
        category: "Directors",
        difficulty: "easy"
    },
    {
        id: 53,
        question: "Which was Rajinikanth's first color film?",
        options: ["Billa", "Murattu Kaalai", "Bhuvana Oru Kelvi Kuri", "16 Vayathinile"],
        correctAnswer: 2,
        funFact: "Bhuvana Oru Kelvi Kuri (1977) was Rajini's first color film, marking a significant step in his career!",
        category: "Milestones",
        difficulty: "hard"
    },
    {
        id: 54,
        question: "In Annamalai, what was Rajinikanth's profession?",
        options: ["Milkman", "Auto driver", "Hotel owner", "Bus conductor"],
        correctAnswer: 0,
        funFact: "In Annamalai (1992), Rajini played a milkman who rises to become a successful entrepreneur!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 55,
        question: "Which actress played the female lead in Enthiran?",
        options: ["Aishwarya Rai", "Deepika Padukone", "Nayanthara", "Trisha"],
        correctAnswer: 0,
        funFact: "Aishwarya Rai Bachchan played Sana, the female lead opposite Rajinikanth in Enthiran (2010)!",
        category: "Co-stars",
        difficulty: "easy"
    },
    {
        id: 56,
        question: "What was the name of Rajinikanth's production company?",
        options: ["Kavithalayaa", "Lotus Arts", "Rajini Arts", "Thalaivar Productions"],
        correctAnswer: 2,
        funFact: "Rajinikanth started Rajini Arts, which produced films like Valli (1993) and Baba (2002)!",
        category: "Career",
        difficulty: "hard"
    },
    {
        id: 57,
        question: "Which film featured Rajinikanth as a spiritual seeker?",
        options: ["Sri Raghavendra", "Baba", "Both A and B", "Thalapathi"],
        correctAnswer: 2,
        funFact: "Rajini played spiritual characters in Sri Raghavendra (1985) as a Hindu saint and Baba (2002) as a spiritual seeker!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 58,
        question: "In which film did Rajinikanth romance actress Nagma?",
        options: ["Veera", "Baashha", "Arunachalam", "Muthu"],
        correctAnswer: 1,
        funFact: "Nagma played the female lead Priya opposite Rajinikanth in the blockbuster Baashha (1995)!",
        category: "Co-stars",
        difficulty: "medium"
    },
    {
        id: 59,
        question: "Which film had Rajinikanth playing dual roles as Lingeshwaran and Lingaa?",
        options: ["Lingaa", "Padayappa", "Sivaji", "Enthiran"],
        correctAnswer: 0,
        funFact: "Lingaa (2014) featured Rajini in a dual role spanning two different time periods!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 60,
        question: "Who was the cinematographer for Thalapathi?",
        options: ["P.C. Sreeram", "Santosh Sivan", "Ravi K. Chandran", "Rajiv Menon"],
        correctAnswer: 1,
        funFact: "Santosh Sivan's cinematography in Thalapathi (1991) is celebrated as one of the finest in Indian cinema!",
        category: "Technical",
        difficulty: "hard"
    },
    {
        id: 61,
        question: "Which Rajinikanth film was based on a story by the star himself?",
        options: ["Baba", "Valli", "Both A and B", "Sivaji"],
        correctAnswer: 2,
        funFact: "Rajinikanth wrote the stories for both Valli (1993) and Baba (2002), showcasing his creative side!",
        category: "Career",
        difficulty: "medium"
    },
    {
        id: 62,
        question: "In which film did Rajinikanth play a character named Pandian?",
        options: ["Pandian", "Murattu Kaalai", "Velaikaran", "Dharmathin Thalaivan"],
        correctAnswer: 0,
        funFact: "Pandian (1992) directed by S.P. Muthuraman featured Rajini in an action-packed role!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 63,
        question: "Who was the femal lead opposite Rajinikanth in Veera?",
        options: ["Meena", "Roja", "Both A and B", "Neither"],
        correctAnswer: 0,
        funFact: "Both Meera and Roja acted as female leads opposite Rajinikanth in Veera (1994)!",
        category: "Co-stars",
        difficulty: "hard"
    },
    {
        id: 64,
        question: "What was the budget of Enthiran?",
        options: ["₹100 crore", "₹132 crore", "₹150 crore", "₹175 crore"],
        correctAnswer: 1,
        funFact: "Enthiran (2010) was made with a budget of ₹132 crore, making it the most expensive Indian film at that time!",
        category: "Box Office",
        difficulty: "hard"
    },
    {
        id: 65,
        question: "Which film featured the iconic 'Super Star' title card for the first time?",
        options: ["Annamalai", "Baashha", "Muthu", "Uzhaippali"],
        correctAnswer: 1,
        funFact: "Annamalai featured the iconic Super Star title card for the first time",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 66,
        question: "In Sivaji, who played the antagonist Adiseshan?",
        options: ["Suman", "Raghuvaran", "Both A and B", "Prakash Raj"],
        correctAnswer: 0,
        funFact: "Suman (as Adiseshan) played antagonist in Sivaji (2007)!",
        category: "Co-stars",
        difficulty: "hard"
    },
    {
        id: 67,
        question: "Which was the first film where Rajinikanth was credited as 'Superstar'?",
        options: ["Billa", "Murattu Kaalai", "Naan Potta Savaal", "Thillu Mullu"],
        correctAnswer: 2,
        funFact: "Naan Potta Savaal (1980) was the first film to officially credit Rajinikanth as 'Superstar' on screen!",
        category: "Milestones",
        difficulty: "hard"
    },
    {
        id: 68,
        question: "Which film featured Rajinikanth as a character named Chinnarasu?",
        options: ["Rajadhi Raja", "Padayappa", "Annamalai", "Sivaji"],
        correctAnswer: 0,
        funFact: "Rajadhi Raja (1989) directed by R. Sundarrajan featured Rajini in a dual roles - Rajashekar and Chinnarasu!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 69,
        question: "Who composed music for Padayappa?",
        options: ["Ilaiyaraaja", "A.R. Rahman", "Deva", "Vidyasagar"],
        correctAnswer: 1,
        funFact: "A.R. Rahman composed the iconic music for Padayappa (1999), including the hit song 'Minsara Poove'!",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 70,
        question: "In which film did Rajinikanth play a character named Ashok Kumar?",
        options: ["Kuselan", "Chandramukhi", "Sivaji", "Enthiran"],
        correctAnswer: 0,
        funFact: "In Kuselan (2008), Rajini played Ashok Kumar, a famous film star, in an extended cameo role!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 71,
        question: "Which director has worked with Rajinikanth on the most number of films?",
        options: ["K. Balachander", "S.P. Muthuraman", "Shankar", "K.S. Ravikumar"],
        correctAnswer: 1,
        funFact: "S.P. Muthuraman directed 25 films with Rajinikanth, the highest collaboration count with any director!",
        category: "Directors",
        difficulty: "medium"
    },
    {
        id: 72,
        question: "What was Rajinikanth's character name in Jailer?",
        options: ["Muthuvel Pandian", "Vikram", "Tiger", "Kaali"],
        correctAnswer: 0,
        funFact: "In Jailer (2023), Rajini played Muthuvel Pandian, a retired jailer, in this blockbuster directed by Nelson Dilipkumar!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 73,
        question: "Which film featured Rajinikanth in the song 'Vaaji Vaaji'?",
        options: ["Sivaji", "Enthiran", "Chandramukhi", "Kuselan"],
        correctAnswer: 0,
        funFact: "'Vaaji Vaaji' from Sivaji (2007) was a high-energy intro song that became hugely popular!",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 74,
        question: "In which year was Muthu released?",
        options: ["1993", "1995", "1997", "1999"],
        correctAnswer: 1,
        funFact: "Muthu was released in 1995, the same year as another Rajini blockbuster, Baashha!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 75,
        question: "How many movies did Sridevi pair with Rajinikanth?",
        options: ["15", "22", "16", "25"],
        correctAnswer: 0,
        funFact: "While Sridevi and Rajinikanth collaborated in 22 movies, they acted as pair in 16",
        category: "Co-stars",
        difficulty: "hard"
    },
    {
        id: 76,
        question: "What was the worldwide gross of Kabali?",
        options: ["₹500 crores", "₹550 crores", "₹305 crores", "₹700 crores"],
        correctAnswer: 2,
        funFact: "Kabali (2016) grossed about ~₹305 crores worldwide, becoming one of the highest-grossing Tamil films that year!",
        category: "Box Office",
        difficulty: "hard"
    },
    {
        id: 77,
        question: "Which film featured the character 'Kaala' in Dharavi?",
        options: ["Kaala", "Petta", "Kabali", "Thalapathi"],
        correctAnswer: 0,
        funFact: "Kaala (2018) directed by Pa. Ranjith featured Rajini as Karikaalan 'Kaala', a don in Mumbai's Dharavi!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 78,
        question: "Who directed Kabali?",
        options: ["Shankar", "Pa. Ranjith", "A.R. Murugadoss", "Karthik Subbaraj"],
        correctAnswer: 1,
        funFact: "Pa. Ranjith directed both Kabali (2016) and Kaala (2018), exploring new dimensions of Rajinikanth's persona!",
        category: "Directors",
        difficulty: "medium"
    },
    {
        id: 79,
        question: "Which film had Rajinikanth playing a cop named Aditya Arunachalam?",
        options: ["Darbar", "Jailer", "Petta", "Vettaiyan"],
        correctAnswer: 0,
        funFact: "In Darbar (2020), Rajini played Mumbai Police Commissioner Aditya Arunachalam!",
        category: "Films",
        difficulty: "medium"
    },
    {
        id: 80,
        question: "What was unique about the film Raja Chinna Roja?",
        options: ["First 3D film", "First with animation", "First color film", "First dubbed film"],
        correctAnswer: 1,
        funFact: "Raja Chinna Roja (1989) was the first Indian film to extensively use animation sequences!",
        category: "Innovation",
        difficulty: "hard"
    },
    {
        id: 81,
        question: "In Annaatthe, what is Rajinikanth's character's relationship to the Keerthy Suresh?",
        options: ["Father", "Brother", "Uncle", "Husband"],
        correctAnswer: 1,
        funFact: "Annaatthe (2021) revolves around the strong brother-sister relationship between Rajini's character and Keerthy Suresh!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 82,
        question: "Which film was Rajinikanth's last black and white movie?",
        options: ["Apoorva Raagangal", "Moondru Mudichu", "16 Vayathinile", "Mullum Malarum"],
        correctAnswer: 2,
        funFact: "16 Vayathinile (1977) was among the last black and white films Rajini acted in before transitioning to color!",
        category: "Milestones",
        difficulty: "hard"
    },
    {
        id: 83,
        question: "Who played the villain in Petta?",
        options: ["Vijay Sethupathi", "Nawazuddin Siddiqui", "Both A and B", "Bobby Simha"],
        correctAnswer: 2,
        funFact: "Both Vijay Sethupathi and Nawazuddin Siddiqui played antagonists in Petta (2019)!",
        category: "Co-stars",
        difficulty: "medium"
    },
    {
        id: 84,
        question: "Which composer created music for Jailer?",
        options: ["A.R. Rahman", "Anirudh Ravichander", "Imman", "Harris Jayaraj"],
        correctAnswer: 1,
        funFact: "Anirudh Ravichander composed the chartbuster music for Jailer (2023), including the hit 'Kaavaalaa'!",
        category: "Music",
        difficulty: "medium"
    },
    {
        id: 85,
        question: "In which film did Rajinikanth play a character named Arunachalam?",
        options: ["Arunachalam", "Darbar", "Sivaji", "Muthu"],
        correctAnswer: 0,
        funFact: "Arunachalam (1997) directed by Sundar C featured Rajini in a dual role as Arunachalam!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 86,
        question: "What was the first film in which Rajinikanth played the lead role?",
        options: ["Bhuvana Oru Kelvi Kuri", "Mullum Malarum", "Bhairavi", "16 Vayathinile"],
        correctAnswer: 1,
        funFact: "Mullum Malarum (1978) gave Rajinikanth his first major lead role as Kali, establishing his star power!",
        category: "Milestones",
        difficulty: "hard"
    },
    {
        id: 87,
        question: "Which film featured the famous 'Kilimanjaro' song?",
        options: ["Enthiran", "Sivaji", "2.0", "Chandramukhi"],
        correctAnswer: 1,
        funFact: "The song 'Sahana' in Sivaji (2007) was shot in Africa and featured the Kilimanjaro backdrop!",
        category: "Music",
        difficulty: "hard"
    },
    {
        id: 88,
        question: "Who played the female lead in 2.0?",
        options: ["Aishwarya Rai", "Amy Jackson", "Nayanthara", "Shriya Saran"],
        correctAnswer: 1,
        funFact: "Amy Jackson played Nila, the humanoid robot, along with Rajinikanth in 2.0 (2018)!",
        category: "Co-stars",
        difficulty: "medium"
    },
    {
        id: 89,
        question: "Which was Rajinikanth's first release after turning 70?",
        options: ["Darbar", "Annaatthe", "Jailer", "Vettaiyan"],
        correctAnswer: 1,
        funFact: "Annaatthe (2021) was Rajinikanth's first release after his 70th birthday on December 12, 2020!",
        category: "Milestones",
        difficulty: "medium"
    },
    {
        id: 90,
        question: "In which film did Rajinikanth play both a father and son?",
        options: ["Lingaa", "Enthiran", "Kochadaiiyaan", "All of the above"],
        correctAnswer: 3,
        funFact: "Rajini played both father and son/dual roles in Lingaa (2014), Kochadaiiyaan (2014), and technically in Enthiran with Vaseegaran and Chitti!",
        category: "Films",
        difficulty: "hard"
    },
    {
        id: 91,
        question: "Which film had the tagline 'The Boss'?",
        options: ["Sivaji", "Enthiran", "Kabali", "Jailer"],
        correctAnswer: 0,
        funFact: "Sivaji (2007) was subtitled 'The Boss', highlighting Rajinikanth's commanding screen presence!",
        category: "Films",
        difficulty: "easy"
    },
    {
        id: 92,
        question: "Who directed Vettaiyan (2024)?",
        options: ["Nelson Dilipkumar", "Lokesh Kanagaraj", "T.J. Gnanavel", "Karthik Subbaraj"],
        correctAnswer: 2,
        funFact: "T.J. Gnanavel, known for Jai Bhim, directed Vettaiyan (2024), Rajini's latest release!",
        category: "Directors",
        difficulty: "medium"
    },
    {
        id: 93,
        question: "Which film featured Rajinikanth with Amitabh Bachchan?",
        options: ["Hum", "Geraftaar", "Andha Kanoon", "All of the above"],
        correctAnswer: 3,
        funFact: "Rajini and Amitabh Bachchan worked together in Hindi films Andha Kanoon (1983), Geraftaar (1985), and Hum (1991)!",
        category: "Co-stars",
        difficulty: "hard"
    },
    {
        id: 94,
        question: "What was the first Tamil film to be dubbed in Japanese?",
        options: ["Muthu", "Padayappa", "Chandramukhi", "Sivaji"],
        correctAnswer: 0,
        funFact: "Muthu (1995) was the first Tamil film to be dubbed and released in Japanese, titled 'Muthu: Dancing Maharaja'!",
        category: "International",
        difficulty: "hard"
    },
    {
        id: 95,
        question: "In which film did Rajinikanth play a character based on Robin Hood?",
        options: ["Uzhaippali", "Velaikaran", "Annamalai", "Thalapathi"],
        correctAnswer: 3,
        funFact: "Thalapathi (1991) has themes similar to Robin Hood, with Rajini's character protecting the poor!",
        category: "Films",
        difficulty: "hard"
    },
    {
        id: 96,
        question: "Which actress played Rajinikanth's sister in Annaatthe?",
        options: ["Meena", "Khushbu", "Keerthy Suresh", "Nayanthara"],
        correctAnswer: 2,
        funFact: "Keerthy Suresh played Rajinikanth's beloved sister in the family drama Annaatthe (2021)!",
        category: "Co-stars",
        difficulty: "easy"
    },
    {
        id: 97,
        question: "Which was Rajinikanth's first Malayalam film?",
        options: ["Allauddinum Albhutha Vilakkum", "Katha Parayumbol", "Ulavacharu Biryani", "Mannan"],
        correctAnswer: 0,
        funFact: "Allauddinum Albhutha Vilakkum (1979) was Rajini's first Malayalam film, a fantasy adventure!",
        category: "Milestones",
        difficulty: "hard"
    },
    {
        id: 98,
        question: "Who directed Rajinikanth in Coolie (2025)?",
        options: ["Nelson Dilipkumar", "Lokesh Kanagaraj", "Vetrimaaran", "Karthik Subbaraj"],
        correctAnswer: 1,
        funFact: "Lokesh Kanagaraj directed Coolie (2025), marking Rajini's 50th year in cinema!",
        category: "Directors",
        difficulty: "easy"
    },
    {
        id: 99,
        question: "Which film featured Rajinikanth's daughter Soundarya as director?",
        options: ["Kochadaiiyaan", "Lal Salaam", "Both A and B", "Lingaa"],
        correctAnswer: 2,
        funFact: "Soundarya Rajinikanth directed both Kochadaiiyaan (2014) and Lal Salaam (2024), with Rajini in special appearances!",
        category: "Directors",
        difficulty: "medium"
    },
    {
        id: 100,
        question: "How many years has Rajinikanth been in cinema by 2025?",
        options: ["45 years", "48 years", "50 years", "52 years"],
        correctAnswer: 2,
        funFact: "By 2025, Rajinikanth completes 50 glorious years in cinema (1975-2025), an unprecedented achievement! Happy Birthday, Thalaivaa!",
        category: "Legacy",
        difficulty: "easy"
    }
];

export default async function handler(req, res) {
    // SECURITY: Protect this endpoint with secret key
    const { secret } = req.query;
    
    if (secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'Invalid or missing secret key' 
        });
    }
    
    try {
        console.log('Starting to seed 100 questions...');
        
        // Store each question in KV
        for (const question of QUESTIONS) {
            await kv.set(QUESTION_KEY(question.id), question);
            console.log(`✓ Seeded question ${question.id}: ${question.question.substring(0, 50)}...`);
        }
        
        // Store list of all question IDs
        const questionIds = QUESTIONS.map(q => q.id);
        await kv.set(ALL_QUESTIONS_KEY, questionIds);
        
        console.log('✓ All 100 questions seeded successfully!');
        
        res.status(200).json({
            success: true,
            message: `Successfully seeded ${QUESTIONS.length} questions to Vercel KV`,
            questionIds,
            totalQuestions: QUESTIONS.length,
            note: 'DELETE this file (/api/admin/seed-questions.js) after seeding for security!'
        });
        
    } catch (error) {
        console.error('❌ Seed error:', error);
        res.status(500).json({ 
            error: 'Failed to seed questions',
            details: error.message 
        });
    }
}
