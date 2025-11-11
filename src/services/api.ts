
import { API_BASE, AMARANTH_JOKERS_TEAM_ID } from '../constants.ts';
// FIX: Import EventResult, EventScore, and EventCategory to resolve type errors.
import { User, UserRole, Team, Event, EventStatus, Report, PointLog, ReportReply, Roster, RulesData, EventResult, EventScore, EventCategory, DetailedScoreHistoryPoint, AppNotification } from '../types.ts';

// --- MOCK DATA & STORAGE ---
const STORAGE_KEY_USERS = 'sims_mock_users';
const STORAGE_KEY_TEAMS = 'sims_mock_teams';
const STORAGE_KEY_EVENTS = 'sims_mock_events_v2';
const STORAGE_KEY_NOTIFICATIONS = 'sims_mock_notifications';
const STORAGE_KEY_REPORTS = 'sims_mock_reports';
const STORAGE_KEY_RULES = 'sims_mock_rules';

export const STORAGE_KEYS = {
    USERS: STORAGE_KEY_USERS,
    TEAMS: STORAGE_KEY_TEAMS,
    EVENTS: STORAGE_KEY_EVENTS,
    NOTIFICATIONS: STORAGE_KEY_NOTIFICATIONS,
    REPORTS: STORAGE_KEY_REPORTS,
    RULES: STORAGE_KEY_RULES,
};

// --- INITIAL MOCK DATA DEFINITIONS ---

// Define a start date for graphs to ensure they have a baseline
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7); // A week ago
const startDateStr = startDate.toISOString().split('T')[0];


const INITIAL_MOCK_USERS: { [id: string]: User } = {
  'admin_1': {
    id: 'admin_1', name: 'Benlor Rivera', email: 'riverabenlor461@gmail.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin1/200',
    firstName: 'Benlor', lastName: 'Rivera', studentId: 'ADMIN-BEN', password: 'password', teamId: AMARANTH_JOKERS_TEAM_ID
  },
  'admin_2': {
    id: 'admin_2', name: 'KCP Admin', email: '2024-1-0277.rivera@kcp.edu.ph', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin2/200',
    firstName: 'KCP', lastName: 'Admin', studentId: '2024-1-0277', password: 'password'
  },
};
INITIAL_MOCK_USERS['admin_1'].password = '24025944';
INITIAL_MOCK_USERS['admin_2'].password = '2024-1-0277aaggmmpp';

const INITIAL_MOCK_TEAMS: Team[] = [
  { rank: 1, id: 't1', name: 'Midnight Spades', score: 0, wins: 0, losses: 0, playersCount: 0, progressHistory: [{ date: startDateStr, score: 0 }], description: 'The Midnight Spades are known for their exceptional performance in coding challenges and their strategic gameplay in board games.', unitLeader: undefined, unitSecretary: undefined, unitTreasurer: undefined, unitErrands: [], adviser: undefined, placementStats: { first: 0, second: 0, third: 0, fourth: 0, merits: 0, demerits: 0 }, merits:[], demerits:[], eventScores:[], joinRequests: [] },
  { rank: 2, id: 't2', name: 'Scarlet Hearts', score: 0, wins: 0, losses: 0, playersCount: 0, progressHistory: [{ date: startDateStr, score: 0 }], unitLeader: undefined, adviser: undefined, placementStats: { first: 0, second: 0, third: 0, fourth: 0, merits: 0, demerits: 0 }, merits:[], demerits:[], eventScores:[], joinRequests: [] },
  { rank: 3, id: 't3', name: 'Emerald Clovers', score: 0, wins: 0, losses: 0, playersCount: 0, progressHistory: [{ date: startDateStr, score: 0 }], unitLeader: undefined, adviser: undefined, placementStats: { first: 0, second: 0, third: 0, fourth: 0, merits: 0, demerits: 0 }, merits:[], demerits:[], eventScores:[], joinRequests: [] },
  { rank: 4, id: 't4', name: 'Glacier Diamonds', score: 0, wins: 0, losses: 0, playersCount: 0, progressHistory: [{ date: startDateStr, score: 0 }], unitLeader: undefined, adviser: undefined, placementStats: { first: 0, second: 0, third: 0, fourth: 0, merits: 0, demerits: 0 }, merits:[], demerits:[], eventScores:[], joinRequests: [] },
  { rank: 0, id: AMARANTH_JOKERS_TEAM_ID, name: 'Amaranth Jokers', score: 0, wins: 0, losses: 0, playersCount: 0, description: 'The official facilitating team for the i3 Day event, composed of student leaders and volunteers dedicated to ensuring a smooth and fair competition for all participants.', adviser: undefined, facilitators: [
      { userId: 'admin_1', position: 'Governor', roleDescription: 'Oversees all event operations and makes final decisions.', permissions: { canAdd: true, canDelete: true, canUpdate: true, canPassScores: true } },
  ], merits:[], demerits:[], eventScores:[], joinRequests: []},
];

const INITIAL_MOCK_EVENTS: Event[] = [
    // Joker Flag Wave 1
    { id: 'jf1', name: 'Joker Flag Wave 1: Chant', category: EventCategory.JOKER_FLAG, officerInCharge: 'Bhenny & Foncee', participantsInfo: 'All supporting audience members', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Game Area', 
      description: 'A rhythmic and melodic team chant that promotes the team’s identity and energy. The chant may be accompanied by coordinated movements, claps, or beats, but should primarily highlight vocal unity and synchronization.',
      mechanics: 'Duration: Minimum of 1 minute.\nFocus on rhythm, clarity, and team synergy.\nLyrics must reflect the team’s values, name, or spirit.\nMust be appropriate and respectful in content.',
      criteria: [
        { name: 'Creativity & Originality', description: 'Uniqueness and innovative approach in chant composition and presentation', points: 30 },
        { name: 'Synchronization & Coordination', description: 'Timing, teamwork, and alignment of movement and rhythm', points: 30 },
        { name: 'Energy & Delivery', description: 'Enthusiasm, projection, and liveliness of performance', points: 20 },
        { name: 'Clarity & Team Identity', description: 'Clear diction, message, and reflection of the team’s character', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    // Joker Flag Wave 2
    { id: 'jf2', name: 'Joker Flag Wave 2: Silent Drill', category: EventCategory.JOKER_FLAG, officerInCharge: 'Bhenny & Foncee', participantsInfo: 'All supporting audience members', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Game Area',
      description: 'A performance showcasing precision, discipline, and creativity using body percussion, movement, and improvised rhythms. Limited vocal use is allowed, but emphasis should be on non-verbal synchronization and impact.',
      mechanics: 'Duration: Minimum of 1 minute.\nMust use body, claps, stomps, or objects (no musical instruments).\nVocal sounds allowed but minimal.\nEmphasis on timing, formation, and group coordination.',
      criteria: [
        { name: 'Precision & Timing', description: 'Accuracy and uniformity in movements and beats', points: 30 },
        { name: 'Creativity & Use of Body Percussion', description: 'Innovation in creating sound and rhythm using the body or improvised means', points: 30 },
        { name: 'Synchronization & Formation', description: 'Cohesiveness of the group and formation transitions', points: 20 },
        { name: 'Overall Impact & Discipline', description: 'General impression, composure, and performance quality', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    // Joker Flag Wave 3
    { id: 'jf3', name: 'Joker Flag Wave 3: Yell', category: EventCategory.JOKER_FLAG, officerInCharge: 'Bhenny & Foncee', participantsInfo: 'All supporting audience members', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Game Area',
      description: 'An intense and powerful vocal performance designed to intimidate rival teams and boost team morale. This wave highlights strength, confidence, and the team’s competitive spirit through commanding chants and unified expressions.',
      mechanics: 'Duration: Minimum of 1 minute.\nFocus on volume, projection, and intensity.\nMust remain respectful (no offensive language or gestures).\nMay include brief team slogans or cheers.',
      criteria: [
        { name: 'Intensity & Energy', description: 'Strength and enthusiasm in vocal performance', points: 30 },
        { name: 'Unity & Vocal Power', description: 'Harmony, coordination, and equal participation', points: 30 },
        { name: 'Message & Delivery', description: 'Clarity and effectiveness of the yell’s message', points: 20 },
        { name: 'Stage Presence & Confidence', description: 'Body language, expression, and command of space', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    
    // CIT Quest
    { id: 'cit1', name: 'Cheer Dance', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: '10–15 performers (mixed gender)', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Gymnasium',
      description: 'A high-energy routine incorporating essential cheerleading elements: dance techniques, formations, and group stunts.',
      mechanics: 'Each unit shall have one (1) entry with 10-15 performers.\nThe performers must be a combination of males and females.\nThe routine must incorporate essential cheerleading elements: dance techniques, formations, and group stunts/pyramids (basket tosses and other high-risk aerial stunts are prohibited for safety).\nThe team can make use of their own song choice as music.\nThe performance must not exceed 5 minutes, including entrance and exit.\nThe use of props (e.g., pompoms, flags, banners) is allowed as long as you take extra precautions and ensure safety.',
      criteria: [
        { name: 'Choreography (Creativity & Artistry)', description: 'Originality, creativity, transitions, and overall composition', points: 50 },
        { name: 'Execution & Energy', description: 'Precision, synchronization, and consistency of movements', points: 30 },
        { name: 'Costume & Visuals', description: 'Appropriateness, design, and appeal of costumes and props', points: 10 },
        { name: 'Overall Impact', description: 'Crowd appeal, confidence, and overall impression', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'cit2', name: 'Banner Competition', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: 'Open', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Lobby Area',
      description: 'Digital banner design competition that showcases team identity and the event theme.',
      mechanics: 'The name of the unit must be visible in the banner, including the icon symbolism of the element.\nRecommends the dimensions of 1920px by 1080px for background use.\nThe banner must be made in Photoshop or any editing tool and must be original work.',
      criteria: [
        { name: 'Relativity of icon and theme', description: 'How well the banner incorporates the unit icon and event theme', points: 40 },
        { name: 'Creativity and Visual Impact', description: 'Innovative design, color scheme, and overall appeal', points: 40 },
        { name: 'Originality', description: 'Uniqueness in approach, ideas, and design', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'cit3', name: 'Cosplay', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: 'Max 5 members for skit', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Stage Area',
      description: 'A cosplay competition representing the unit’s symbol and theme, featuring a mascot character.',
      mechanics: 'The design must incorporate elements representing the unit’s icon or symbol.\nIt must reflect the theme of the event.\nAt least 50% of the costume must be made from recycled or eco-friendly materials.\nCostumes must not include dangerous or sharp objects.\nParticipants must perform a 2-minute skit or walk showcasing their mascot/cosplay.\nGroups are allowed for the skit, with a maximum of 5 members, focusing on one mascot.',
      criteria: [
        { name: 'Relativity of icon and theme', description: 'Reflects unit’s icon and aligns with event theme', points: 20 },
        { name: 'Creativity', description: 'Innovation in materials, design, and presentation', points: 40 },
        { name: 'Appearance', description: 'Visual appeal, craftsmanship, and quality', points: 40 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'cit4', name: 'Amazing Race', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: 'All players available', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Campus Wide',
      description: 'A fast-paced race featuring a mix of physical, mental, and teamwork challenges across multiple stations.',
      mechanics: 'Open to all members.\nFeatures a mix of physical, mental, and teamwork challenges.\nThe fastest team to complete all stations wins.\nTeamwork and safety are required at all times.',
      criteria: [
        { name: 'Time Finished', description: 'Teams ranked by completion time', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'cit5', name: 'General Quiz', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: 'All members must join', date: new Date(Date.now() + 86400000 * 5).toISOString(), venue: 'Auditorium',
      description: 'A mass quiz competition covering IT topics, current events, general knowledge, and Cordilleran subjects.',
      mechanics: 'A flag must be raised and marched while answering the quiz, serving as basis for elimination.\nIf a player carries the flag of another team and wins, only the flag is valid.\nCovers: IT topics, current events, general knowledge, and traditional Cordilleran subjects.\nAll members must participate.',
      criteria: [
        { name: 'Correct Answers', description: 'Score based on number of correct answers until elimination', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    
    // Larong Lahi (CIT Quest)
    { id: 'cit6', name: 'Larong Lahi: Dodgeball', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: '25 mixed players per team', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Open Field',
      description: 'A competitive team sport in which players throw balls and try to hit opponents while avoiding being hit.',
      mechanics: 'Each team shall consist of 25 mixed players.\nStart with 5 balls, 5 min duration per match.\nTeam with most remaining players wins at time expiration.\nHit by ball = elimination.\nStepping out of bounds = elimination.\nCatching opponent thrown ball = thrower eliminated + 1 teammate rejoins.',
      criteria: [
          { name: 'Players Remaining', description: 'Count of players left at the end of match', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'cit7', name: 'Larong Lahi: Tug of War', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: '10 male, 10 female (separate rounds)', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Open Field',
      description: 'A test of strength where two teams pull on opposite ends of a rope.',
      mechanics: '10 males and 10 females (separate categories).\nThe male category will have 2 rounds with a different set of players in the 2nd round.\nTeams pull until the red flag crosses the line of the stronger team.',
      criteria: [
        { name: 'Match Wins', description: 'Winning the designated rounds', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'cit8', name: 'Larong Lahi: Ag-Agtoo', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: '10 male, 10 female', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Open Field',
      description: 'A traditional relay race involving baskets.',
      mechanics: '10 males and 10 females (separate categories).\n4 baskets (1 basket per team).\nThe first team to finish the required task will be declared the winner.',
      criteria: [
        { name: 'Time Finished', description: 'Ranked by order of finishing the task', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'cit9', name: 'Solo Singing', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: '1 participant', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Stage Area',
      description: 'Individual vocal competition.',
      mechanics: 'Performance must be live; lip-syncing is strictly prohibited.\nMale and female participants compete in a single category.\nPerformers may use either a minus-one track or a live instrument.',
      criteria: [
        { name: 'Vocal Quality', description: 'Clarity, tone, pitch accuracy, diction, and overall vocal control', points: 50 },
        { name: 'Musicality & Interpretation', description: 'Expression, phrasing, timing, rhythm, and emotional connection', points: 30 },
        { name: 'Stage Presence', description: 'Confidence, audience connection, and charisma', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'cit10', name: 'Duet Singing', category: EventCategory.CIT_QUEST, officerInCharge: 'Yesha', participantsInfo: '2 participants (any combination)', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Stage Area',
      description: 'Vocal duet competition highlighting harmony and chemistry.',
      mechanics: 'Performance must be live; lip-syncing is strictly prohibited.\nDuos may consist of any partner combination.\nMay use minus-one or live instrument.',
      criteria: [
        { name: 'Vocal Quality & Synchronization', description: 'Clarity, tone, pitch, and blending of voices', points: 50 },
        { name: 'Musicality & Interpretation', description: 'Creativity, expression, delivery, and emotional depth', points: 30 },
        { name: 'Stage Presence', description: 'Confidence, coordination, and chemistry between partners', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },

    // MindScape
    { id: 'ms1', name: 'Essay Writing (English)', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '1 participant', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Classroom A',
      description: 'Essay writing competition in English.',
      mechanics: 'Length: 600–1000 words. Entries below or beyond the limit may receive point deductions.\nOriginality: Must be the participant’s own work; proper citation required.\nPlagiarism: Must not exceed 20% similarity.',
      criteria: [
        { name: 'Content & Relevance', description: 'Accuracy, depth, and quality of information presented', points: 40 },
        { name: 'Originality', description: 'Creativity, uniqueness, and innovative approach', points: 40 },
        { name: 'Organization', description: 'Structure, flow, and logical arrangement of ideas', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'ms2', name: 'Essay Writing (Filipino)', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '1 participant', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Classroom A',
      description: 'Essay writing competition in Filipino.',
      mechanics: 'Length: 600–1000 words.\nOriginality: Must be participant’s own work.\nPlagiarism: Must not exceed 20% similarity.',
      criteria: [
        { name: 'Content & Relevance', description: 'Accuracy, depth, and quality of information', points: 40 },
        { name: 'Originality', description: 'Creativity, uniqueness, and innovative approach', points: 40 },
        { name: 'Organization', description: 'Structure, flow, and logical arrangement', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'ms3', name: 'Debate', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '3 participants per team', date: new Date(Date.now() + 86400000 * 5).toISOString(), venue: 'Audio Visual Room',
      description: 'Oxford-Oregano style debate on IT topics.',
      mechanics: '3 speakers per team (Proposition vs Opposition).\nSpeakers: 5 mins each. Rebuttals: 2 mins.\nWarning bell at 4 mins.\nNo electronic devices allowed during the debate.\nFocus on quality of argumentation.',
      criteria: [
        { name: 'Content and Argumentation', description: 'Strength, clarity, depth, and evidence of arguments', points: 40 },
        { name: 'Rebuttals and Refutations', description: 'Effectiveness in addressing and dismantling opposing arguments', points: 30 },
        { name: 'Team Coordination and Strategy', description: 'Unified case and smooth transitions between speakers', points: 15 },
        { name: 'Delivery and Persuasion', description: 'Confidence, eloquence, and persuasive delivery', points: 15 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },
    { id: 'ms4', name: 'Impromptu Speech', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '1 participant', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Stage Area',
      description: 'On-the-spot speech delivery.',
      mechanics: '1 participant per unit.\n1 minute prep time, 3 minutes speech maximum.\nTopics drawn randomly.\nNo notes or devices allowed.',
      criteria: [
        { name: 'Content', description: 'Substance, accuracy, depth, meaningfulness, and relevance', points: 40 },
        { name: 'Coherence', description: 'Logical flow, clarity, organization, and unity of ideas', points: 30 },
        { name: 'Delivery', description: 'Confidence, voice projection, expression, and audience engagement', points: 30 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'ms5', name: 'Extemporaneous Speech', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '1 participant', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Stage Area',
      description: 'Speech delivery with limited preparation time on current issues.',
      mechanics: '1 participant per unit.\n5 mins prep time, 3 mins speech maximum.\nTopics: current/relevant social issues.\nBrief notes allowed during prep but not reading directly.',
      criteria: [
        { name: 'Content', description: 'Substance, accuracy, depth, meaningfulness, and relevance', points: 40 },
        { name: 'Coherence', description: 'Logical flow, clarity, organization, and unity of ideas', points: 30 },
        { name: 'Delivery', description: 'Confidence, voice projection, expression, and engagement', points: 30 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'ms6', name: 'Math Quiz', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '4 members per unit', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Hall B',
      description: 'Math competition consisting of individual and team rounds covering computation, logic, and IT applications.',
      mechanics: '4 members per unit.\nIndividual and team rounds.\nQuestions: computation, logic, IT-related math.\nNo calculators allowed unless specified.\nTie-breaker: sudden-death round.',
      criteria: [
        { name: 'Quiz Score', description: 'Total combined points from individual and team rounds', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'ms7', name: 'Hackathon', category: EventCategory.MINDSCAPE, officerInCharge: 'Lryn', participantsInfo: '3 representatives', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Computer Lab 1',
      description: 'Brainstorming session to ideate IT solutions for real-world problems.',
      mechanics: '3 representatives per unit.\nDevelop original IT solution (idea, planning, prototype, presentation).\n5 minutes pitch deck presentation using PowerPoint.',
      criteria: [
        { name: 'Originality and Creativity', description: 'Uniqueness of idea and innovative solution', points: 40 },
        { name: 'Project Planning and Feasibility', description: 'Clarity, realism, and feasibility of the plan', points: 30 },
        { name: 'Technical Implementation and Prototype', description: 'Quality of implementation and prototype representation', points: 20 },
        { name: 'Presentation and Communication', description: 'Effective communication, confidence, clarity, and professionalism', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },

    // Hoop & Spike
    { id: 'hs1', name: 'Basketball (Men)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '12 players', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Court A',
      description: 'Full court basketball competition.',
      mechanics: 'Double-elimination bracket.\nFollows standard basketball rules.\n12 players per team.\nFouls, delays, or unsportsmanlike conduct may result in deductions.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'hs2', name: 'Basketball (Women)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '12 players', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Court A',
      description: 'Full court basketball competition.',
      mechanics: 'Double-elimination bracket.\nFollows standard basketball rules.\n12 players (plus substitutes).\nFouls, delays, or unsportsmanlike conduct may result in deductions.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'hs3', name: 'Volleyball (Men)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '12 players', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Volleyball Court',
      description: 'Standard volleyball tournament.',
      mechanics: '12 players per team.\nMatches follow official volleyball rules (rally point scoring).\nUnsportsmanlike conduct results in penalties.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'hs4', name: 'Volleyball (Women)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '12 players', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Volleyball Court',
      description: 'Standard volleyball tournament.',
      mechanics: '12 players per team.\nMatches follow official volleyball rules (rally point scoring).\nUnsportsmanlike conduct results in penalties.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
    { id: 'hs5', name: 'Badminton (Men\'s Singles)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '1 player', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Gymnasium Side B',
      description: 'Singles badminton tournament.',
      mechanics: '1 player per unit.\nBest-of-three (3) games format.\n21-point rally scoring.\nPlayers bring their own rackets, shuttlecocks provided.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'hs6', name: 'Badminton (Women\'s Singles)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '1 player', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Gymnasium Side B',
      description: 'Singles badminton tournament.',
      mechanics: '1 player per unit.\nBest-of-three (3) games format.\n21-point rally scoring.\nPlayers bring their own rackets, shuttlecocks provided.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'hs7', name: 'Badminton (Mixed Doubles)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '1 pair per team', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Gymnasium Side B',
      description: 'Mixed doubles badminton tournament.',
      mechanics: '1 pair per unit.\nBest-of-three (3) games format.\n21-point rally scoring.\nPlayers bring their own rackets, shuttlecocks provided.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },
    { id: 'hs8', name: 'Table Tennis (Men\'s Singles)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '1 player', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Table Tennis Hall',
      description: 'Singles table tennis tournament.',
      mechanics: '1 player per unit.\nBest-of-five (5) sets (11-point system).\nStandard ITTF rules apply.\nPlayers bring their own paddles.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'hs9', name: 'Table Tennis (Women\'s Singles)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '1 player', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Table Tennis Hall',
      description: 'Singles table tennis tournament.',
      mechanics: '1 player per unit.\nBest-of-five (5) sets (11-point system).\nStandard ITTF rules apply.\nPlayers bring their own paddles.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'hs10', name: 'Table Tennis (Mixed Doubles)', category: EventCategory.HOOP_SPIKE, officerInCharge: 'Joshua and Jericho', participantsInfo: '1 pair per team', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Table Tennis Hall',
      description: 'Mixed doubles table tennis tournament.',
      mechanics: '1 pair per unit.\nBest-of-five (5) sets (11-point system).\nStandard ITTF rules apply.\nPlayers bring their own paddles.',
      criteria: [
        { name: 'Match Results', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },

    // Coding & Tech
    { id: 'ct1', name: 'Programming', category: EventCategory.CODING_TECH_CHALLENGES, officerInCharge: 'Lorenz and Foncee', participantsInfo: '4 representatives', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Computer Lab 2',
      description: 'Coding competition to solve problem sets.',
      mechanics: '4 representatives per unit (different year levels).\nProblem set provided on-site.\n3 hours to complete.\nJudged by correctness and efficiency (number of problems solved).\nTie-breaker: sum of elapsed times of correct submissions.',
      criteria: [
        { name: 'Problems Solved Correctly', description: 'Score based on number of completed tasks and time', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },
    { id: 'ct2', name: 'Find the Bug', category: EventCategory.CODING_TECH_CHALLENGES, officerInCharge: 'Lorenz and Foncee', participantsInfo: '4 representatives', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Computer Lab 2',
      description: 'Debugging competition using Notepad++.',
      mechanics: '4 representatives per unit.\nFind and fix bugs in pre-written code using Notepad++.\nMost corrected bugs within time wins.',
      criteria: [
        { name: 'Bugs Fixed', description: 'Number of successfully identified and corrected bugs', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },
    { id: 'ct3', name: 'Web Design', category: EventCategory.CODING_TECH_CHALLENGES, officerInCharge: 'Lorenz and Foncee', participantsInfo: '4 representatives', date: new Date(Date.now() + 86400000 * 1).toISOString(), venue: 'Computer Lab 1',
      description: 'Web design competition with a specific task provided on-site.',
      mechanics: '4 representatives per unit.\n4 hours to complete task.\nAllowed: HTML, CSS, JS, Bootstrap, Tailwind, AIs etc.\nMust stop after time limit.',
      criteria: [
        { name: 'Relevance', description: 'Relevance to the assigned task', points: 40 },
        { name: 'Design', description: 'Visual aesthetics and layout', points: 30 },
        { name: 'Creativity', description: 'Originality and innovation in design', points: 20 },
        { name: 'Functionality', description: 'Working features and usability', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },
    { id: 'ct4', name: 'Monkey Type', category: EventCategory.CODING_TECH_CHALLENGES, officerInCharge: 'Lorenz and Foncee', participantsInfo: '1 representative', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Computer Lab 3',
      description: 'Typing speed and accuracy test.',
      mechanics: '1 representative per unit.\nDouble elimination bracket.\n5-minute rounds.\nHighest score based on WPM and accuracy proceeds.',
      criteria: [
        { name: 'Typing Speed (WPM)', description: 'Words Per Minute correctly typed', points: 50 },
        { name: 'Accuracy', description: 'Percentage of correctly typed words', points: 40 },
        { name: 'Consistency and Focus', description: 'Steady pace and minimal mistakes/backspacing', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'ct5', name: 'PC Building', category: EventCategory.CODING_TECH_CHALLENGES, officerInCharge: 'Lorenz and Foncee', participantsInfo: '2 participants (tag team)', date: new Date(Date.now() + 86400000 * 2).toISOString(), venue: 'Hardware Lab',
      description: 'Disassemble and reassemble a PC within time.',
      mechanics: '2 participants tag team.\nDisassemble and reassemble within time.',
      criteria: [
        { name: 'Accuracy', description: 'Correctness and precision of actions', points: 50 },
        { name: 'Speed', description: 'Time taken to complete task', points: 30 },
        { name: 'Teamwork', description: 'Coordination and collaboration', points: 20 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },

    // Pixel Play
    { id: 'pp1', name: 'Video Making', category: EventCategory.PIXEL_PLAY, officerInCharge: 'Sean & Kyle Nieto', participantsInfo: '3-4 members from same unit', date: new Date(Date.now() + 86400000 * 7).toISOString(), venue: 'Online Submission',
      description: 'Short video promoting the team theme "Why Choose IT?".',
      mechanics: '3-4 members.\nDuration: 3-5 mins.\nMobile phones only for filming.\nEditing tools allowed.\nAI-generated content prohibited.\nMust be original, filmed at school whenever possible.\nTheme: "Why Choose IT?".\nSubmit .MP4/.MOV before ceremony.',
      criteria: [
        { name: 'Creativity', description: 'Originality, artistic expression, and innovative approach', points: 30 },
        { name: 'Technical Quality', description: 'Execution, editing flow, camera work, and visual excellence', points: 30 },
        { name: 'Message', description: 'Clarity and effectiveness of communicating the theme', points: 30 },
        { name: 'Overall Impact', description: 'Emotional appeal and memorability', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'pp2', name: 'Infographics', category: EventCategory.PIXEL_PLAY, officerInCharge: 'Sean & Kyle Nieto', participantsInfo: '1 representative', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Computer Lab A',
      description: 'Design an infographic on "Why Choose IT?".',
      mechanics: '1 representative.\nDimensions: 1080x1920 (9:16).\nUse Adobe Photoshop, Illustrator, Canva etc.\nSubmit raw file and PNG + Rationale Form.\nMust be done on-site.',
      criteria: [
        { name: 'Relevance to the Prompt', description: 'Effective addressing of the theme', points: 40 },
        { name: 'Design and Visual Impact', description: 'Overall quality, appeal, and layout', points: 30 },
        { name: 'Creativity', description: 'Originality and innovation', points: 20 },
        { name: 'Clarity and Organization', description: 'Clear communication and structured content', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'pp3', name: 'Traditional Poster Making', category: EventCategory.PIXEL_PLAY, officerInCharge: 'Sean & Kyle Nieto', participantsInfo: '1 representative', date: new Date(Date.now() + 86400000 * 3).toISOString(), venue: 'Art Room',
      description: 'Poster making on "IT in Culture" using traditional medium.',
      mechanics: '1 representative.\n¼ illustration board (provided).\nBring own materials (any medium).\nCreated on-site only.\nTheme: "IT in Culture".',
      criteria: [
        { name: 'Relevance to the Prompt', description: 'Effective addressing of the theme', points: 40 },
        { name: 'Design and Visual Impact', description: 'Overall design, appeal, and layout', points: 30 },
        { name: 'Creativity', description: 'Originality and innovative use of materials', points: 20 },
        { name: 'Clarity and Organization', description: 'Clarity of message and arrangement of elements', points: 10 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'pp4', name: 'Hotspot Havoc', category: EventCategory.PIXEL_PLAY, officerInCharge: 'Sean & Kyle Nieto', participantsInfo: '5 players per team', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Student Lounge',
      description: 'Offline mobile multiplayer tournament (Mini Militia, BombSquad, Special Forces Group 2).',
      mechanics: '5 players per team.\nRound-robin format.\n1 representative per match.\nGames: Mini Militia, BombSquad, Special Forces Group 2.',
      criteria: [
        { name: 'Placement Points', description: 'Total points accumulated from match placements (1st: 100, 2nd: 80, 3rd: 60, 4th: 40)', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1500, judges: [], results: [] },
      
    // Table Masters
    { id: 'tm1', name: 'Games of the Generals', category: EventCategory.TABLE_MASTERS, officerInCharge: 'Jeverlyn, Israel', participantsInfo: '1 male, 1 female per team', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Table Games Area',
      description: 'Strategic board game involving military ranks.',
      mechanics: 'Double-elimination format.\n1 male, 1 female per team.\n15 minutes per game.\nStandard rules apply.\nWin by capturing flag or challenging flag with higher/correct piece.',
      criteria: [
        { name: 'Match Result', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'tm2', name: 'Chess', category: EventCategory.TABLE_MASTERS, officerInCharge: 'Jeverlyn, Israel', participantsInfo: '1 male, 1 female per team', date: new Date(Date.now() + 86400000 * 4).toISOString(), venue: 'Table Games Area',
      description: 'Standard chess tournament.',
      mechanics: '1 male, 1 female per team.\nDouble-elimination format.\n30 mins per player.\nTouch-move rule.\nWin by checkmate, resignation, or time (points based).',
      criteria: [
        { name: 'Match Result', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'tm3', name: 'Scrabble', category: EventCategory.TABLE_MASTERS, officerInCharge: 'Jeverlyn, Israel', participantsInfo: '2 contestants', date: new Date(Date.now() + 86400000 * 5).toISOString(), venue: 'Table Games Area',
      description: 'Word game tournament.',
      mechanics: '2 contestants per unit.\nDouble-elimination scheme.\nSpecific rules on-site.',
      criteria: [
        { name: 'Match Result', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'tm4', name: 'Darts (Singles)', category: EventCategory.TABLE_MASTERS, officerInCharge: 'Jeverlyn, Israel', participantsInfo: 'Individual', date: new Date(Date.now() + 86400000 * 5).toISOString(), venue: 'Darts Area',
      description: '501 format darts tournament.',
      mechanics: 'Individual participant.\nDouble elimination (if 8+ players) or single elimination.\nBest-of-3 legs, 501 format.\nMust finish on double or bullseye.',
      criteria: [
        { name: 'Match Result', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1000, judges: [], results: [] },
    { id: 'tm5', name: 'Darts (Doubles)', category: EventCategory.TABLE_MASTERS, officerInCharge: 'Jeverlyn, Israel', participantsInfo: '2 players', date: new Date(Date.now() + 86400000 * 5).toISOString(), venue: 'Darts Area',
      description: '501 format team darts.',
      mechanics: '2 players per team.\nDouble elimination (4-8 teams).\nBest-of-5 legs, 501 format.\nAlternating turns.',
      criteria: [
        { name: 'Match Result', description: 'Bracket Progression', points: 100 }
      ],
      status: EventStatus.UPCOMING, competitionPoints: 1200, judges: [], results: [] },
];

const INITIAL_MOCK_REPORTS: Report[] = [];

const INITIAL_RULES_DATA: RulesData = {
    mainTitle: 'i3 Day | Clash of Cards', subTitle: 'CIT Tech and Sports Fest 2025', hashTags: '#SDG9 #SDG13 #SDG17',
    sections: [
        { id: 'objectives', title: 'Objectives', items: [{ type: 'list', items: ['To showcase the diverse talents and skills of information technology students and faculty...', 'To promote sportsmanship, healthy competition, and community spirit...'] }] },
        { id: 'house_rules', title: 'House Rules', items: [{ type: 'heading', level: 3, content: 'Attendance and Participation' }, { type: 'list', items: ['All students are required to participate...', 'This activity is part of the college calendar...', '...primary goal is to promote unity...', 'Double entries in solo events are not allowed...'] }] },
    ]
};

// Helper to get data from localStorage, falling back to a default
const getStoredData = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        console.error(`Could not parse ${key} from localStorage`, e);
        return defaultValue;
    }
};

// Helper to set data in localStorage and dispatch an event for real-time updates
const STORAGE_EVENT_KEY = 'storage-update';
const setStoredData = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    // This event is picked up by the useSyncedData hook to trigger UI updates
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_KEY, { detail: { key } }));
};

// Seed initial data if it doesn't exist in localStorage
const seedInitialData = () => {
    if (!localStorage.getItem(STORAGE_KEY_USERS)) localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_MOCK_USERS));
    if (!localStorage.getItem(STORAGE_KEY_TEAMS)) localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(INITIAL_MOCK_TEAMS));
    if (!localStorage.getItem(STORAGE_KEY_EVENTS)) localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(INITIAL_MOCK_EVENTS));
    if (!localStorage.getItem(STORAGE_KEY_REPORTS)) localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_MOCK_REPORTS));
    if (!localStorage.getItem(STORAGE_KEY_RULES)) localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(INITIAL_RULES_DATA));
};
seedInitialData();

let notificationStore = getStoredData<AppNotification[]>(STORAGE_KEY_NOTIFICATIONS, []);

const broadcastNotification = (notificationDetails: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...notificationDetails,
    };
    notificationStore.unshift(newNotification);
    if (notificationStore.length > 50) { // Cap storage
        notificationStore = notificationStore.slice(0, 50);
    }
    setStoredData(STORAGE_KEY_NOTIFICATIONS, notificationStore);
};


// Centralized function to recalculate all scores and rankings
function recalculateAndRankLeaderboard() {
    let leaderboardStore = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
    const todayStr = new Date().toISOString().split('T')[0];

    leaderboardStore.forEach(team => {
        // Generate detailed progress history
        const allScoreEvents: { timestamp: string, reason: string, change: number }[] = [];

        (team.eventScores || []).forEach(es => {
            const event = getStoredData<Event[]>(STORAGE_KEY_EVENTS, []).find(e => e.id === es.eventId);
            allScoreEvents.push({
                timestamp: event ? event.date : new Date().toISOString(),
                reason: `Event: ${es.eventName}`,
                change: es.competitionPoints,
            });
        });

        (team.merits || []).forEach(merit => {
            allScoreEvents.push({
                timestamp: merit.timestamp,
                reason: `Merit: ${merit.reason}`,
                change: merit.points,
            });
        });

        (team.demerits || []).forEach(demerit => {
            allScoreEvents.push({
                timestamp: demerit.timestamp,
                reason: `Demerit: ${demerit.reason}`,
                change: -demerit.points,
            });
        });

        allScoreEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        let cumulativeScore = 0;
        const detailedHistory: DetailedScoreHistoryPoint[] = [];
        
        detailedHistory.push({
            timestamp: startDateStr,
            score: 0,
            reason: 'Competition Start',
            change: 0,
        });

        allScoreEvents.forEach(event => {
            cumulativeScore += event.change;
            detailedHistory.push({
                timestamp: event.timestamp,
                score: cumulativeScore,
                reason: event.reason,
                change: event.change,
            });
        });
        
        team.detailedProgressHistory = detailedHistory;
        
        // Calculate total score
        const totalEventPoints = team.eventScores?.reduce((sum, s) => sum + s.competitionPoints, 0) || 0;
        const totalMerits = team.merits?.reduce((sum, m) => sum + m.points, 0) || 0;
        const totalDemerits = team.demerits?.reduce((sum, d) => sum + d.points, 0) || 0;
        team.score = totalEventPoints + totalMerits - totalDemerits;

        const oldCurrentScore = team.scoreHistory?.[1];
        team.scoreHistory = [oldCurrentScore ?? 0, team.score];

        if (team.id !== AMARANTH_JOKERS_TEAM_ID) {
            let newProgress = [...(team.progressHistory || [])];
            if (newProgress.length === 0) {
                newProgress.push({ date: startDateStr, score: 0 });
            }
            const todayEntryIndex = newProgress.findIndex(p => p.date === todayStr);
            if (todayEntryIndex > -1) {
                newProgress[todayEntryIndex].score = team.score;
            } else {
                newProgress.push({ date: todayStr, score: team.score });
            }
            team.progressHistory = newProgress;
        }

        const newStats = { first: 0, second: 0, third: 0, fourth: 0, merits: 0, demerits: 0 };
        team.eventScores?.forEach(es => {
            if (es.placement === 1) newStats.first++;
            else if (es.placement === 2) newStats.second++;
            else if (es.placement === 3) newStats.third++;
            else if (es.placement >= 4) newStats.fourth++;
        });
        newStats.merits = team.merits?.length || 0;
        newStats.demerits = team.demerits?.length || 0;
        team.placementStats = newStats;
    });

    const competingTeams = leaderboardStore.filter(t => t.id !== AMARANTH_JOKERS_TEAM_ID);
    competingTeams.sort((a, b) => b.score - a.score);
    
    let lastScore = -Infinity;
    let currentRank = 0;
    competingTeams.forEach((team, index) => {
        if (team.score !== lastScore) {
            currentRank = index + 1;
            lastScore = team.score;
        }
        team.rank = currentRank;
    });

    setStoredData(STORAGE_KEY_TEAMS, leaderboardStore);
    return leaderboardStore;
};

// One-time rank correction on load to fix stale initial data
recalculateAndRankLeaderboard();

// --- MOCK API IMPLEMENTATION ---
const mockApi = {
    login: (email: string, pass: string): Promise<User> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const usersStore = getStoredData<{[id: string]: User}>(STORAGE_KEY_USERS, {});
            const user = Object.values(usersStore).find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                if (user.password === pass) {
                    resolve(user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            } else {
                reject(new Error('User not found'));
            }
          }, 500);
        });
    },
    loginWithGoogle: (googleData: { email: string; firstName: string; lastName: string; avatar?: string }): Promise<{ user: User, isNew: boolean }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const usersStore = getStoredData<{[id: string]: User}>(STORAGE_KEY_USERS, {});
                const existingUser = Object.values(usersStore).find(u => u.email.toLowerCase() === googleData.email.toLowerCase());
                if (existingUser) {
                    resolve({ user: existingUser, isNew: false });
                } else {
                    const partialUser: User = {
                        id: `google_user_${Date.now()}`,
                        email: googleData.email,
                        firstName: googleData.firstName,
                        lastName: googleData.lastName,
                        name: `${googleData.firstName} ${googleData.lastName}`,
                        role: UserRole.USER,
                        avatar: googleData.avatar || 'https://picsum.photos/seed/google/200',
                    };
                    resolve({ user: partialUser, isNew: true });
                }
            }, 300);
        });
    },
    completeUserProfile: (userData: User): Promise<User> => {
        const usersStore = getStoredData<{ [id: string]: User }>(STORAGE_KEY_USERS, {});
        usersStore[userData.id] = { ...usersStore[userData.id], ...userData };
        setStoredData(STORAGE_KEY_USERS, usersStore);
        return Promise.resolve(userData);
    },
    register: (userData: Partial<User>): Promise<User> => {
        const usersStore = getStoredData<{ [id: string]: User }>(STORAGE_KEY_USERS, {});
        const existingUser = Object.values(usersStore).find(u => u.email.toLowerCase() === (userData.email || '').toLowerCase());
        if (existingUser) {
            return Promise.reject(new Error('Email already exists'));
        }
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: `${userData.firstName} ${userData.lastName}`,
            role: UserRole.USER,
            avatar: `https://picsum.photos/seed/${Date.now()}/200`,
            ...userData,
        } as User;
        usersStore[newUser.id] = newUser;
        setStoredData(STORAGE_KEY_USERS, usersStore);
        broadcastNotification({
            title: 'New Registration',
            message: `${newUser.name} just joined SIMS!`,
            link: `/admin`,
            type: 'info',
            target: { roles: [UserRole.ADMIN, UserRole.OFFICER] }
        });
        return Promise.resolve(newUser);
    },
    deleteUser: (userId: string): Promise<void> => {
        const usersStore = getStoredData<{ [id: string]: User }>(STORAGE_KEY_USERS, {});
        const deletedUser = usersStore[userId];
        delete usersStore[userId];
        setStoredData(STORAGE_KEY_USERS, usersStore);
         if (deletedUser) {
            broadcastNotification({
                title: 'User Removed',
                message: `User ${deletedUser.name} has been removed from the system.`,
                link: '/admin',
                type: 'warning',
                target: { roles: [UserRole.ADMIN] }
            });
        }
        return Promise.resolve();
    },
    updateUserRole: (userId: string, role: UserRole): Promise<User> => {
        const usersStore = getStoredData<{ [id: string]: User }>(STORAGE_KEY_USERS, {});
        const user = Object.values(usersStore).find(u => u.id === userId);
        if (user) {
            user.role = role;
            usersStore[user.id] = user;
            setStoredData(STORAGE_KEY_USERS, usersStore);
            broadcastNotification({
                title: 'Role Updated',
                message: `${user.name}'s role has been changed to ${role}.`,
                link: '/admin',
                type: 'info',
                target: { roles: [UserRole.ADMIN] }
            });
            return Promise.resolve(user);
        }
        return Promise.reject(new Error("User not found"));
    },
    addEvent: (eventData: Partial<Event>): Promise<Event> => {
        const eventsStore = getStoredData<Event[]>(STORAGE_KEY_EVENTS, []);
        const newEvent = { id: `evt_${Date.now()}`, ...eventData } as Event;
        eventsStore.push(newEvent);
        setStoredData(STORAGE_KEY_EVENTS, eventsStore);
        broadcastNotification({
            title: 'New Event Added',
            message: `A new event "${newEvent.name}" has been scheduled.`,
            link: `/events?eventId=${newEvent.id}`,
            type: 'success'
        });
        return Promise.resolve(newEvent);
    },
    updateEvent: (eventData: Event): Promise<Event> => {
        let eventsStore = getStoredData<Event[]>(STORAGE_KEY_EVENTS, []);
        eventsStore = eventsStore.map(e => e.id === eventData.id ? { ...e, ...eventData } : e);
        setStoredData(STORAGE_KEY_EVENTS, eventsStore);
        broadcastNotification({
            title: 'Event Details Updated',
            message: `The details for "${eventData.name}" have been updated.`,
            link: `/events?eventId=${eventData.id}`,
            type: 'info'
        });
        return Promise.resolve(eventData);
    },
    deleteEvent: (eventId: string): Promise<void> => {
        let eventsStore = getStoredData<Event[]>(STORAGE_KEY_EVENTS, []);
        const deletedEvent = eventsStore.find(e => e.id === eventId);
        eventsStore = eventsStore.filter(e => e.id !== eventId);
        setStoredData(STORAGE_KEY_EVENTS, eventsStore);
        if (deletedEvent) {
            broadcastNotification({
                title: 'Event Removed',
                message: `The event "${deletedEvent.name}" has been removed.`,
                link: `/events`,
                type: 'warning'
            });
        }
        return Promise.resolve();
    },
    updateEventResults: (eventId: string, results: EventResult[]): Promise<Event> => {
        const eventsStore = getStoredData<Event[]>(STORAGE_KEY_EVENTS, []);
        const eventIndex = eventsStore.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return Promise.reject(new Error("Event not found"));
        
        const event = eventsStore[eventIndex];
        event.results = results;
        event.status = EventStatus.COMPLETED;
        
        const teamRawScores = results.map(res => {
            const criteriaScore = Object.values(res.criteriaScores).reduce((sum, val) => sum + (Number(val) || 0), 0);
            const totalMerits = res.merits?.reduce((sum, m) => sum + (m.points || 0), 0) || 0;
            const totalDemerits = res.demerits?.reduce((sum, d) => sum + (d.points || 0), 0) || 0;
            return {
                teamId: res.teamId,
                rawScore: criteriaScore + totalMerits - totalDemerits,
                breakdown: res,
                totalMerits,
                totalDemerits
            };
        }).sort((a, b) => b.rawScore - a.rawScore);

        const multipliers = [1, 0.8, 0.64, 0.512];
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);

        let lastRawScore = -Infinity;
        let currentPlacement = 0;
        teamRawScores.forEach((item, index) => {
            const team = teams.find(t => t.id === item.teamId);
            if (!team) return;

            if (item.rawScore !== lastRawScore) {
                currentPlacement = index + 1;
                lastRawScore = item.rawScore;
            }
            const placement = currentPlacement;
            
            const multiplier = multipliers[placement - 1] || 0.1;
            const compPoints = Math.round(event.competitionPoints * multiplier);
            
            const newEventScore: EventScore = {
                eventId,
                eventName: event.name,
                placement,
                competitionPoints: compPoints,
                rawScore: item.rawScore,
                scores: event.criteria.map(c => ({ criteria: c.name, score: item.breakdown.criteriaScores[c.name] || 0, maxScore: c.points })),
                meritAdjustment: item.totalMerits,
                demeritAdjustment: item.totalDemerits,
                merits: item.breakdown.merits || [],
                demerits: item.breakdown.demerits || [],
            };

            const otherScores = team.eventScores?.filter(es => es.eventId !== eventId) || [];
            team.eventScores = [...otherScores, newEventScore];
        });

        setStoredData(STORAGE_KEY_TEAMS, teams);
        setStoredData(STORAGE_KEY_EVENTS, eventsStore);
        recalculateAndRankLeaderboard();
         broadcastNotification({
            title: 'Scores Finalized',
            message: `Results for "${event.name}" are in! Check the updated standings.`,
            link: `/leaderboard`,
            type: 'success'
        });
        return Promise.resolve(event);
    },
    updateTeam: (teamData: Team): Promise<Team> => {
        let teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        let users = getStoredData<{[id: string]: User}>(STORAGE_KEY_USERS, {});
        const teamIndex = teams.findIndex(t => t.id === teamData.id);
        if (teamIndex === -1) return Promise.reject(new Error("Team not found"));

        const oldTeam = teams[teamIndex];
        const newTeam = { ...oldTeam, ...teamData };

        // Handle role changes for unit leader
        if (oldTeam.unitLeader && oldTeam.unitLeader !== newTeam.unitLeader) {
            const oldLeader = users[oldTeam.unitLeader];
            if (oldLeader && oldLeader.role === UserRole.TEAM_LEAD) {
                oldLeader.role = UserRole.USER;
            }
        }
        if (newTeam.unitLeader && oldTeam.unitLeader !== newTeam.unitLeader) {
            const newLeader = users[newTeam.unitLeader];
            if (newLeader) {
                newLeader.role = UserRole.TEAM_LEAD;
                newLeader.teamId = newTeam.id;
            }
        }
        
        // Handle Amaranth Jokers Facilitator team assignment
        if (newTeam.id === AMARANTH_JOKERS_TEAM_ID) {
            const oldFacilitatorIds = oldTeam.facilitators?.map(f => f.userId) || [];
            const newFacilitatorIds = newTeam.facilitators?.map(f => f.userId) || [];
            
            const removedIds = oldFacilitatorIds.filter(id => !newFacilitatorIds.includes(id));
            const addedIds = newFacilitatorIds.filter(id => !oldFacilitatorIds.includes(id));

            removedIds.forEach(userId => {
                if (users[userId] && users[userId].role !== UserRole.ADMIN) { // Don't remove admin's team
                    users[userId].teamId = undefined; 
                }
            });
            addedIds.forEach(userId => {
                if (users[userId]) {
                    users[userId].teamId = AMARANTH_JOKERS_TEAM_ID;
                }
            });
        }
        
        teams[teamIndex] = newTeam;
        setStoredData(STORAGE_KEY_USERS, users);
        setStoredData(STORAGE_KEY_TEAMS, teams);
        return Promise.resolve(newTeam);
    },
    updateTeamRoster: (teamId: string, eventId: string, participants: string[]): Promise<Team> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const team = teams.find(t => t.id === teamId);
        if (!team) return Promise.reject(new Error("Team not found"));

        if (!team.rosters) team.rosters = [];
        const rosterIndex = team.rosters.findIndex(r => r.eventId === eventId);
        if (rosterIndex > -1) {
            team.rosters[rosterIndex].participants = participants;
        } else {
            team.rosters.push({ eventId, participants });
        }
        setStoredData(STORAGE_KEY_TEAMS, teams);
        return Promise.resolve(team);
    },
    addPointLog: (log: Partial<PointLog> & { teamId: string, type: 'merit' | 'demerit' }): Promise<void> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const team = teams.find(t => t.id === log.teamId);
        if (!team) return Promise.reject(new Error("Team not found"));

        const newLog: PointLog = { id: `log_${Date.now()}`, timestamp: new Date().toISOString(), updatedBy: 'Admin', ...log } as PointLog;
        if (log.type === 'merit') {
            if (!team.merits) team.merits = [];
            team.merits.push(newLog);
        } else {
            if (!team.demerits) team.demerits = [];
            team.demerits.push(newLog);
        }
        setStoredData(STORAGE_KEY_TEAMS, teams);
        broadcastNotification({
            title: log.type === 'merit' ? 'Merit Awarded' : 'Demerit Issued',
            message: `Team ${team.name} received ${log.points} points for: ${log.reason}`,
            link: `/teams?teamId=${team.id}&tab=merits`,
            type: log.type === 'merit' ? 'success' : 'warning'
        });
        recalculateAndRankLeaderboard();
        return Promise.resolve();
    },
    updatePointLog: (logId: string, teamId: string, logData: Partial<PointLog>): Promise<void> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const team = teams.find(t => t.id === teamId);
        if (!team) return Promise.reject(new Error("Team not found"));
        
        const meritIndex = team.merits?.findIndex(m => m.id === logId);
        if (meritIndex !== undefined && meritIndex > -1) {
            team.merits![meritIndex] = { ...team.merits![meritIndex], ...logData };
        } else {
            const demeritIndex = team.demerits?.findIndex(d => d.id === logId);
            if (demeritIndex !== undefined && demeritIndex > -1) {
                team.demerits![demeritIndex] = { ...team.demerits![demeritIndex], ...logData };
            } else {
                return Promise.reject(new Error("Log entry not found"));
            }
        }
        setStoredData(STORAGE_KEY_TEAMS, teams);
        recalculateAndRankLeaderboard();
        return Promise.resolve();
    },
    deletePointLog: (logId: string, teamId: string, type: 'merit' | 'demerit'): Promise<void> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const team = teams.find(t => t.id === teamId);
        if (!team) return Promise.reject(new Error("Team not found"));
        
        if (type === 'merit') team.merits = team.merits?.filter(m => m.id !== logId);
        else team.demerits = team.demerits?.filter(d => d.id !== logId);
        
        setStoredData(STORAGE_KEY_TEAMS, teams);
        recalculateAndRankLeaderboard();
        return Promise.resolve();
    },
    submitReport: (reportData: any): Promise<void> => {
        const reports = getStoredData<Report[]>(STORAGE_KEY_REPORTS, []);
        const newReport: Report = { id: `rep_${Date.now()}`, timestamp: new Date().toISOString(), status: 'pending', replies: [], ...reportData };
        reports.unshift(newReport);
        setStoredData(STORAGE_KEY_REPORTS, reports);
        broadcastNotification({
            title: `New ${reportData.type} Submitted`,
            message: `A new ${reportData.type} has been submitted for review.`,
            link: '/reports',
            type: 'info',
            target: { roles: [UserRole.ADMIN, UserRole.OFFICER] }
        });
        return Promise.resolve();
    },
    updateReportStatus: (reportId: string, status: Report['status']): Promise<Report> => {
        const reports = getStoredData<Report[]>(STORAGE_KEY_REPORTS, []);
        const report = reports.find(r => r.id === reportId);
        if (!report) return Promise.reject(new Error("Report not found"));
        report.status = status;
        setStoredData(STORAGE_KEY_REPORTS, reports);
        broadcastNotification({
            title: `Report Status: ${status}`,
            message: `Your submission has been marked as ${status}.`,
            link: '/reports',
            type: 'info',
            target: { userId: report.submittedBy }
        });
        broadcastNotification({
            title: 'Report Updated',
            message: `A report was marked as ${status} by an admin.`,
            link: '/reports',
            type: 'info',
            target: { roles: [UserRole.ADMIN, UserRole.OFFICER] }
        });
        return Promise.resolve(report);
    },
    addReportReply: (reportId: string, replyData: { message: string, repliedBy: string }): Promise<Report> => {
        const reports = getStoredData<Report[]>(STORAGE_KEY_REPORTS, []);
        const report = reports.find(r => r.id === reportId);
        if (!report) return Promise.reject(new Error("Report not found"));
        
        const newReply: ReportReply = { id: `reply_${Date.now()}`, timestamp: new Date().toISOString(), ...replyData };
        if (!report.replies) report.replies = [];
        report.replies.push(newReply);
        setStoredData(STORAGE_KEY_REPORTS, reports);
        broadcastNotification({
            title: `New Reply on Your Report`,
            message: `A manager has replied to your submission.`,
            link: '/reports',
            type: 'info',
            target: { userId: report.submittedBy }
        });
        broadcastNotification({
            title: `New Reply on Report`,
            message: `A new reply was posted on a report.`,
            link: '/reports',
            type: 'info',
            target: { roles: [UserRole.ADMIN, UserRole.OFFICER] }
        });
        return Promise.resolve(report);
    },
    updateRules: (rulesData: RulesData): Promise<RulesData> => {
        setStoredData(STORAGE_KEY_RULES, rulesData);
        broadcastNotification({
            title: 'Rules Updated',
            message: 'The Rules & Regulations have been updated. Please review the changes.',
            link: '/rules',
            type: 'warning'
        });
        return Promise.resolve(rulesData);
    },
    requestToJoinTeam: (teamId: string, userId: string): Promise<void> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const users = getStoredData<{[id:string]:User}>(STORAGE_KEY_USERS, {});
        const user = users[userId];
        if (user.teamId) return Promise.reject(new Error("You are already on a team."));
        const hasPendingRequest = teams.some(t => t.joinRequests?.some(r => r.userId === userId));
        if (hasPendingRequest) return Promise.reject(new Error("You already have a pending join request."));
        const team = teams.find(t => t.id === teamId);
        if (!team) return Promise.reject(new Error("Team not found."));
        if (!team.joinRequests) team.joinRequests = [];
        team.joinRequests.push({ userId, timestamp: new Date().toISOString() });
        setStoredData(STORAGE_KEY_TEAMS, teams);
        broadcastNotification({
            title: 'New Join Request',
            message: `${user?.name || 'A user'} has requested to join ${team.name}.`,
            link: `/teams?teamId=${team.id}&tab=requests`,
            type: 'info',
            target: { teamId: team.id, roles: [UserRole.TEAM_LEAD, UserRole.ADMIN, UserRole.OFFICER] }
        });
        return Promise.resolve();
    },
    cancelJoinRequest: (userId: string): Promise<void> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        let teamUpdated = false;
        teams.forEach(team => {
            if (team.joinRequests) {
                const initialLength = team.joinRequests.length;
                team.joinRequests = team.joinRequests.filter(req => req.userId !== userId);
                if (team.joinRequests.length < initialLength) teamUpdated = true;
            }
        });
        if (teamUpdated) {
            setStoredData(STORAGE_KEY_TEAMS, teams);
            return Promise.resolve();
        }
        return Promise.reject(new Error("No pending request found to cancel."));
    },
    manageJoinRequest: (teamId: string, userId: string, action: 'accept' | 'reject'): Promise<void> => {
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const users = getStoredData<{[id:string]:User}>(STORAGE_KEY_USERS, {});
        const team = teams.find(t => t.id === teamId);
        if (!team || !team.joinRequests) return Promise.reject(new Error("Team or request not found."));
        const requestIndex = team.joinRequests.findIndex(req => req.userId === userId);
        if (requestIndex === -1) return Promise.reject(new Error("Request not found."));
        if (action === 'accept') {
            const user = users[userId];
            if (!user) return Promise.reject(new Error("User not found."));
            if (user.teamId) return Promise.reject(new Error("User is already on another team."));
            user.teamId = teamId;
            setStoredData(STORAGE_KEY_USERS, users);
        }
        team.joinRequests.splice(requestIndex, 1);
        setStoredData(STORAGE_KEY_TEAMS, teams);
        return Promise.resolve();
    },
    getUsers: (): Promise<User[]> => Promise.resolve(Object.values(getStoredData(STORAGE_KEY_USERS, {}))),
    getLeaderboard: (): Promise<Team[]> => {
        const users = Object.values(getStoredData<{[id:string]:User}>(STORAGE_KEY_USERS, {}));
        const teams = getStoredData<Team[]>(STORAGE_KEY_TEAMS, []);
        const updatedTeams = teams.map(team => ({
            ...team,
            playersCount: users.filter(u => u.teamId === team.id).length
        }));
        return Promise.resolve(updatedTeams);
    },
    getEvents: (): Promise<Event[]> => Promise.resolve(getStoredData(STORAGE_KEY_EVENTS, [])),
    getReports: (): Promise<Report[]> => Promise.resolve(getStoredData(STORAGE_KEY_REPORTS, [])),
    getRules: (): Promise<RulesData> => Promise.resolve(getStoredData(STORAGE_KEY_RULES, {} as RulesData)),
    getTeamUsers: (teamId: string): Promise<User[]> => Promise.resolve(Object.values(getStoredData<{ [id: string]: User }>(STORAGE_KEY_USERS, {})).filter(u => u.teamId === teamId)),
    getNotifications: (): Promise<any[]> => Promise.resolve(getStoredData(STORAGE_KEY_NOTIFICATIONS, [])),
};

// --- EXPORTED API FUNCTIONS (Wrapper to switch between mock and real API) ---
const useMock = API_BASE === '/mock';

export const login = useMock ? mockApi.login : async (email: string, pass: string): Promise<User> => { throw new Error("Not implemented") };
export const loginWithGoogle = useMock ? mockApi.loginWithGoogle : async (googleData: any): Promise<{ user: User, isNew: boolean }> => { throw new Error("Not implemented") };
export const completeUserProfile = useMock ? mockApi.completeUserProfile : async (userData: User): Promise<User> => { throw new Error("Not implemented") };
export const register = useMock ? mockApi.register : async (userData: Partial<User>): Promise<User> => { throw new Error("Not implemented") };
export const deleteUser = useMock ? mockApi.deleteUser : async (userId: string): Promise<void> => { throw new Error("Not implemented") };
export const getUsers = useMock ? mockApi.getUsers : async (): Promise<User[]> => { throw new Error("Not implemented") };
export const updateUserRole = useMock ? mockApi.updateUserRole : async (userId: string, role: UserRole): Promise<User> => { throw new Error("Not implemented") };
export const getLeaderboard = useMock ? mockApi.getLeaderboard : async (): Promise<Team[]> => { throw new Error("Not implemented") };
export const getEvents = useMock ? mockApi.getEvents : async (): Promise<Event[]> => { throw new Error("Not implemented") };
export const addEvent = useMock ? mockApi.addEvent : async (eventData: Partial<Event>): Promise<Event> => { throw new Error("Not implemented") };
export const updateEvent = useMock ? mockApi.updateEvent : async (eventData: Event): Promise<Event> => { throw new Error("Not implemented") };
export const deleteEvent = useMock ? mockApi.deleteEvent : async (eventId: string): Promise<void> => { throw new Error("Not implemented") };
export const updateEventResults = useMock ? mockApi.updateEventResults : async (eventId: string, results: any[]): Promise<Event> => { throw new Error("Not implemented") };
export const getTeamUsers = useMock ? mockApi.getTeamUsers : async (teamId: string): Promise<User[]> => { throw new Error("Not implemented") };
export const getNotifications = useMock ? mockApi.getNotifications : async (): Promise<any[]> => { throw new Error("Not implemented") };
export const getReports = useMock ? mockApi.getReports : async (): Promise<Report[]> => { throw new Error("Not implemented") };
export const submitReport = useMock ? mockApi.submitReport : async (reportData: any): Promise<void> => { throw new Error("Not implemented") };
export const updateReportStatus = useMock ? mockApi.updateReportStatus : async (reportId: string, status: Report['status']): Promise<Report> => { throw new Error("Not implemented") };
export const addReportReply = useMock ? mockApi.addReportReply : async (reportId: string, replyData: any): Promise<Report> => { throw new Error("Not implemented") };
export const getRules = useMock ? mockApi.getRules : async (): Promise<RulesData> => { throw new Error("Not implemented") };
export const updateRules = useMock ? mockApi.updateRules : async (rulesData: RulesData): Promise<RulesData> => { throw new Error("Not implemented") };
export const updateTeam = useMock ? mockApi.updateTeam : async (teamData: Team): Promise<Team> => { throw new Error("Not implemented") };
export const updateTeamRoster = useMock ? mockApi.updateTeamRoster : async (teamId: string, eventId: string, participants: string[]): Promise<Team> => { throw new Error("Not implemented") };
export const addPointLog = useMock ? mockApi.addPointLog : async (log: any): Promise<void> => { throw new Error("Not implemented") };
export const updatePointLog = useMock ? mockApi.updatePointLog : async (logId: string, teamId: string, logData: Partial<PointLog>): Promise<void> => { throw new Error("Not implemented") };
export const deletePointLog = useMock ? mockApi.deletePointLog : async (logId: string, teamId: string, type: 'merit' | 'demerit'): Promise<void> => { throw new Error("Not implemented") };
export const requestToJoinTeam = useMock ? mockApi.requestToJoinTeam : async (teamId: string, userId: string): Promise<void> => { throw new Error("Not implemented") };
export const cancelJoinRequest = useMock ? mockApi.cancelJoinRequest : async (userId: string): Promise<void> => { throw new Error("Not implemented") };
export const manageJoinRequest = useMock ? mockApi.manageJoinRequest : async (teamId: string, userId: string, action: 'accept' | 'reject'): Promise<void> => { throw new Error("Not implemented") };