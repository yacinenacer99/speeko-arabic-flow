// Topics — single source of truth for challenge prompts.

export interface Topic {
  id: number;
  question: string;
  forbiddenWords: string[];
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export const TOPICS: Topic[] = [
  { id: 1, question: "كيف الناس غالبًا يقضّون الويكند عندكم؟", forbiddenWords: ["طلعات", "مول", "استراحة"], category: "الحياة اليومية", difficulty: "easy" },
  { id: 2, question: "وش اللي يخلي اليوم فعلاً يمر عليك بشكل منتج؟", forbiddenWords: ["جدول", "مهام", "إنجاز"], category: "الحياة اليومية", difficulty: "easy" },
  { id: 3, question: "كيف تغيّرت الحياة اليومية خلال آخر عشر سنوات؟", forbiddenWords: ["جوال", "سوشال", "سرعة"], category: "الحياة اليومية", difficulty: "easy" },
  { id: 4, question: "وش العادات اللي تساعد الشخص يكون مرتب ومنظّم؟", forbiddenWords: ["منبه", "نوتات", "مواعيد"], category: "الحياة اليومية", difficulty: "easy" },
  { id: 5, question: "وش أكبر الأشياء اللي تشتّت الناس في يومهم حاليًا؟", forbiddenWords: ["إشعارات", "تيك توك", "جوال"], category: "الحياة اليومية", difficulty: "easy" },
  { id: 6, question: "ليه فيه ناس يحبون الحياة المليانة حركة، وناس يفضّلون الهدوء؟", forbiddenWords: ["ضغط", "فضاوة", "طاقة"], category: "الحياة اليومية", difficulty: "easy" },
  { id: 7, question: "كيف غيّرت التقنية طريقة تواصل الناس؟", forbiddenWords: ["واتساب", "رسائل", "مكالمات"], category: "التقنية", difficulty: "easy" },
  { id: 8, question: "وش إيجابيات وسلبيات السوشال ميديا؟", forbiddenWords: ["مشاهير", "ترند", "محتوى"], category: "التقنية", difficulty: "easy" },
  { id: 9, question: "برأيك، هل الجوالات الذكية سهّلت الحياة أو زادت التوتر؟", forbiddenWords: ["إشعارات", "تطبيقات", "شاشة"], category: "التقنية", difficulty: "easy" },
  { id: 10, question: "كيف الذكاء الاصطناعي قاعد يأثر على الحياة اليومية؟", forbiddenWords: ["شات جي بي تي", "وظائف", "واجبات"], category: "التقنية", difficulty: "easy" },
  { id: 11, question: "وش أكثر أنواع التقنية اللي الناس معتمدين عليها اليوم؟", forbiddenWords: ["جوال", "لابتوب", "إنترنت"], category: "التقنية", difficulty: "easy" },
  { id: 12, question: "كيف تتوقع التقنية تغيّر التعليم بالمستقبل؟", forbiddenWords: ["أونلاين", "أجهزة", "منصات"], category: "التقنية", difficulty: "easy" },
  { id: 13, question: "وش اللي يخلّي المعلّم فعلاً ممتاز؟", forbiddenWords: ["شرح", "واجبات", "اختبار"], category: "التعليم", difficulty: "easy" },
  { id: 14, question: "وش أكبر المشاكل اللي يواجهها التعليم اليوم؟", forbiddenWords: ["مناهج", "درجات", "حفظ"], category: "التعليم", difficulty: "easy" },
  { id: 15, question: "هل الأفضل المدارس تركّز أكثر على المهارات العملية أو المعرفة الأكاديمية؟", forbiddenWords: ["وظيفة", "نظري", "شهادات"], category: "التعليم", difficulty: "easy" },
  { id: 16, question: "كيف تغيّر التعلّم بسبب الإنترنت؟", forbiddenWords: ["يوتيوب", "قوقل", "دورات"], category: "التعليم", difficulty: "easy" },
  { id: 17, question: "وش المواد اللي المفروض كل طالب يتعلّمها؟", forbiddenWords: ["رياضيات", "إنجليزي", "علوم"], category: "التعليم", difficulty: "easy" },
  { id: 18, question: "ليه بعض الطلاب يستمتعون بالتعلّم أكثر من غيرهم؟", forbiddenWords: ["درجات", "ملل", "مدرس"], category: "التعليم", difficulty: "easy" },
  { id: 19, question: "وش اللي يخلّي الوظيفة ممتعة فعلًا؟", forbiddenWords: ["راتب", "مدير", "إجازات"], category: "العمل والمسار المهني", difficulty: "easy" },
  { id: 20, question: "ليه الناس يختارون مسارات مهنية مختلفة؟", forbiddenWords: ["فلوس", "شغف", "أهل"], category: "العمل والمسار المهني", difficulty: "easy" },
  { id: 21, question: "وش أهم المهارات للنجاح في العمل؟", forbiddenWords: ["خبرة", "تواصل", "التزام"], category: "العمل والمسار المهني", difficulty: "easy" },
  { id: 22, question: "كيف تغيّرت فكرة 'الوظيفة الجيدة' مع الوقت؟", forbiddenWords: ["راتب", "أمان", "دوام"], category: "العمل والمسار المهني", difficulty: "easy" },
  { id: 23, question: "هل الشغل من البيت أفضل أو العمل من المكتب؟", forbiddenWords: ["مرونة", "زحمة", "راحة"], category: "العمل والمسار المهني", difficulty: "easy" },
  { id: 24, question: "ليه بعض الناس يغيّرون مسارهم المهني أكثر من مرة؟", forbiddenWords: ["ملل", "فرصة", "راتب"], category: "العمل والمسار المهني", difficulty: "easy" },
  { id: 25, question: "ليه الناس يحبون السفر؟", forbiddenWords: ["إجازة", "فندق", "مطار"], category: "السفر والأماكن", difficulty: "medium" },
  { id: 26, question: "وش ممكن يتعلّم الشخص من زيارة أماكن جديدة؟", forbiddenWords: ["ثقافات", "تصوير", "سياحة"], category: "السفر والأماكن", difficulty: "medium" },
  { id: 27, question: "وش اللي يخلّي المدينة مكان مناسب للعيش؟", forbiddenWords: ["زحمة", "خدمات", "أمان"], category: "السفر والأماكن", difficulty: "medium" },
  { id: 28, question: "كيف السياحة تأثر على البلد؟", forbiddenWords: ["فنادق", "مطاعم", "اقتصاد"], category: "السفر والأماكن", difficulty: "medium" },
  { id: 29, question: "وش الفرق بين العيشة في مدينة كبيرة والعيشة في بلدة صغيرة؟", forbiddenWords: ["زحمة", "هدوء", "جيران"], category: "السفر والأماكن", difficulty: "medium" },
  { id: 30, question: "ليه بعض الأماكن تجذب الناس أكثر من غيرها؟", forbiddenWords: ["جو", "طبيعة", "فعاليات"], category: "السفر والأماكن", difficulty: "medium" },
  { id: 31, question: "ليه الأكل جزء مهم جدًا من ثقافة أي مجتمع؟", forbiddenWords: ["ضيافة", "أطباق", "مناسبات"], category: "الأكل ونمط الحياة", difficulty: "medium" },
  { id: 32, question: "كيف تغيّرت عادات الأكل اليوم؟", forbiddenWords: ["مطاعم", "دايت", "توصيل"], category: "الأكل ونمط الحياة", difficulty: "medium" },
  { id: 33, question: "وش اللي يخلّي المطعم يعلق في ذاكرة الناس؟", forbiddenWords: ["طعم", "ديكور", "خدمة"], category: "الأكل ونمط الحياة", difficulty: "medium" },
  { id: 34, question: "ليه بعض الناس يحبون الطبخ، وغيرهم لا؟", forbiddenWords: ["وصفات", "وقت", "مطبخ"], category: "الأكل ونمط الحياة", difficulty: "medium" },
  { id: 35, question: "كيف الوجبات السريعة تأثر على نمط الحياة الحديث؟", forbiddenWords: ["وزن", "وقت", "صحة"], category: "الأكل ونمط الحياة", difficulty: "medium" },
  { id: 36, question: "وش أنواع الأكل اللي صارت تنتشر أكثر هالأيام؟", forbiddenWords: ["صحي", "ترند", "مطاعم"], category: "الأكل ونمط الحياة", difficulty: "medium" },
  { id: 37, question: "ليه الناس يحبون الأفلام والمسلسلات لهالدرجة؟", forbiddenWords: ["نتفلكس", "قصة", "شخصيات"], category: "الترفيه", difficulty: "medium" },
  { id: 38, question: "كيف تغيّر الترفيه بسبب الإنترنت؟", forbiddenWords: ["يوتيوب", "بث", "منصات"], category: "الترفيه", difficulty: "medium" },
  { id: 39, question: "وش اللي يخلّي فيلم أو برنامج ينجح؟", forbiddenWords: ["ممثلين", "قصة", "إعلان"], category: "الترفيه", difficulty: "medium" },
  { id: 40, question: "ليه الناس تختلف أذواقهم في الترفيه؟", forbiddenWords: ["ملل", "جو", "نوع"], category: "الترفيه", difficulty: "medium" },
  { id: 41, question: "هل مشاهدة المحتوى القصير قاعدة تغيّر انتباه الناس؟", forbiddenWords: ["تيك توك", "ريلز", "سرعة"], category: "الترفيه", difficulty: "medium" },
  { id: 42, question: "وش دور الموسيقى في حياة الناس؟", forbiddenWords: ["أغاني", "مشاعر", "حفلات"], category: "الترفيه", difficulty: "medium" },
  { id: 43, question: "ليه الرياضة مهمة في المجتمع؟", forbiddenWords: ["لياقة", "صحة", "نادي"], category: "الرياضة والصحة", difficulty: "medium" },
  { id: 44, question: "ليه بعض الناس يحبون الرياضة، وغيرهم يتجنبونها؟", forbiddenWords: ["تعب", "حماس", "وقت"], category: "الرياضة والصحة", difficulty: "medium" },
  { id: 45, question: "كيف يقدر الإنسان يحافظ على صحته في الحياة الحديثة؟", forbiddenWords: ["أكل", "نوم", "تمرين"], category: "الرياضة والصحة", difficulty: "medium" },
  { id: 46, question: "هل الصحة صارت أهم عند الناس اليوم؟", forbiddenWords: ["وعي", "فحوصات", "مكملات"], category: "الرياضة والصحة", difficulty: "medium" },
  { id: 47, question: "وش فوائد ممارسة الرياضة كهواية؟", forbiddenWords: ["لياقة", "أصدقاء", "متعة"], category: "الرياضة والصحة", difficulty: "medium" },
  { id: 48, question: "ليه كثير ناس يعانون مع الاستمرارية في التمرين؟", forbiddenWords: ["حماس", "جدول", "نادي"], category: "الرياضة والصحة", difficulty: "medium" },
  { id: 49, question: "وش التغييرات اللي صارت في المجتمع في السنوات الأخيرة؟", forbiddenWords: ["سوشال", "سرعة", "انفتاح"], category: "المجتمع", difficulty: "hard" },
  { id: 50, question: "ليه الترندات تنتشر بسرعة اليوم؟", forbiddenWords: ["تيك توك", "مشاهير", "محتوى"], category: "المجتمع", difficulty: "hard" },
  { id: 51, question: "وش اللي يخلّي المجتمع المحلي قوي ومتماسك؟", forbiddenWords: ["تعاون", "جيران", "عائلة"], category: "المجتمع", difficulty: "hard" },
  { id: 52, question: "كيف يختلف الشباب اليوم عن الأجيال الأكبر؟", forbiddenWords: ["جوال", "أفكار", "سرعة"], category: "المجتمع", difficulty: "hard" },
  { id: 53, question: "وش أكثر المشاكل اللي يواجهها الناس اليوم؟", forbiddenWords: ["فلوس", "ضغط", "وقت"], category: "المجتمع", difficulty: "hard" },
  { id: 54, question: "ليه الآراء تنتشر بسهولة في الإنترنت؟", forbiddenWords: ["سوشال", "تعليق", "مشاهير"], category: "المجتمع", difficulty: "hard" },
  { id: 55, question: "ليه الناس يشترون أشياء هم أصلًا ما يحتاجونها؟", forbiddenWords: ["عروض", "إعلان", "ملل"], category: "الشراء والأعمال", difficulty: "hard" },
  { id: 56, question: "كيف غيّر التسوق الإلكتروني سلوك المستهلك؟", forbiddenWords: ["توصيل", "تطبيقات", "سرعة"], category: "الشراء والأعمال", difficulty: "hard" },
  { id: 57, question: "وش اللي يخلّي البراند يصير محبوب ومنتشر؟", forbiddenWords: ["شعار", "جودة", "إعلان"], category: "الشراء والأعمال", difficulty: "hard" },
  { id: 58, question: "ليه بعض الشركات تنجح وبعضها يفشل؟", forbiddenWords: ["فلوس", "تسويق", "إدارة"], category: "الشراء والأعمال", difficulty: "hard" },
  { id: 59, question: "كيف الإعلانات تأثر على الناس؟", forbiddenWords: ["شراء", "مشهور", "عروض"], category: "الشراء والأعمال", difficulty: "hard" },
  { id: 60, question: "وش اللي يخلّي العميل يثق في شركة؟", forbiddenWords: ["جودة", "خدمة", "سمعة"], category: "الشراء والأعمال", difficulty: "hard" },
  { id: 61, question: "وش اللي يخلّي المدينة مريحة للعيش؟", forbiddenWords: ["زحمة", "خدمات", "أمان"], category: "البيئة والمدن", difficulty: "hard" },
  { id: 62, question: "كيف يقدر الناس يساهمون في حماية البيئة؟", forbiddenWords: ["تدوير", "بلاستيك", "تلوث"], category: "البيئة والمدن", difficulty: "hard" },
  { id: 63, question: "ليه المساحات الخضراء مهمة داخل المدن؟", forbiddenWords: ["حدائق", "هواء", "راحة"], category: "البيئة والمدن", difficulty: "hard" },
  { id: 64, question: "وش أبرز التحديات البيئية اليوم؟", forbiddenWords: ["حرارة", "تلوث", "نفايات"], category: "البيئة والمدن", difficulty: "hard" },
  { id: 65, question: "كيف النقل العام يأثر على الحياة اليومية؟", forbiddenWords: ["زحمة", "سيارات", "مترو"], category: "البيئة والمدن", difficulty: "hard" },
  { id: 66, question: "وش التغييرات اللي ممكن تحسّن المدن بالمستقبل؟", forbiddenWords: ["طرق", "حدائق", "مشاريع"], category: "البيئة والمدن", difficulty: "hard" },
  { id: 67, question: "كيف تتوقع شكل حياة الناس بالمستقبل؟", forbiddenWords: ["روبوتات", "تقنية", "سرعة"], category: "أسئلة مستقبلية", difficulty: "hard" },
  { id: 68, question: "وش الوظائف اللي ممكن تختفي خلال العشرين سنة الجاية؟", forbiddenWords: ["ذكاء اصطناعي", "أتمتة", "موظفين"], category: "أسئلة مستقبلية", difficulty: "hard" },
  { id: 69, question: "كيف ممكن يتغيّر التعليم بالمستقبل؟", forbiddenWords: ["مدارس", "أونلاين", "شهادات"], category: "أسئلة مستقبلية", difficulty: "hard" },
  { id: 70, question: "كيف تتوقع شكل المدن في المستقبل؟", forbiddenWords: ["أبراج", "سيارات", "زحمة"], category: "أسئلة مستقبلية", difficulty: "hard" },
  { id: 71, question: "كيف ممكن التقنية تطوّر الرعاية الصحية؟", forbiddenWords: ["مستشفيات", "أطباء", "أجهزة"], category: "أسئلة مستقبلية", difficulty: "hard" },
  { id: 72, question: "وش التغييرات اللي تتوقعها في طريقة عمل الناس؟", forbiddenWords: ["مكاتب", "دوام", "ريموت"], category: "أسئلة مستقبلية", difficulty: "hard" },
];

const INTEREST_TO_CATEGORY: Record<string, string> = {
  daily: "الحياة اليومية",
  work: "العمل والمسار المهني",
  tech: "التقنية والمستقبل",
  growth: "التطوير الشخصي",
  culture: "الثقافة والمجتمع",
  media: "المحتوى والإعلام",
};

/**
 * Resolve allowed topic difficulties for the current stage.
 * @param userStage Current stage (1-6).
 * @returns Set of allowed difficulties.
 */
function allowedDifficultiesByStage(userStage: number): Set<Topic["difficulty"]> {
  if (userStage <= 2) return new Set(["easy"]);
  if (userStage <= 4) return new Set(["easy", "medium"]);
  return new Set(["easy", "medium", "hard"]);
}

/**
 * Select one topic using stage difficulty, interests, and recent topic exclusions.
 * @param userStage Current stage (1-6).
 * @param userInterests User interests/categories.
 * @param recentTopicIds Recently used topic ids.
 * @returns Selected topic object.
 */
export function selectTopic(userStage: number, userInterests: string[], recentTopicIds: number[]): Topic {
  const allowed = allowedDifficultiesByStage(userStage);
  const byDifficulty = TOPICS.filter((topic) => allowed.has(topic.difficulty));
  const recentSet = new Set(recentTopicIds);
  const mappedCategories = userInterests
    .map((code) => INTEREST_TO_CATEGORY[code])
    .filter((c): c is string => typeof c === "string" && c.length > 0);
  const categorySet = new Set(mappedCategories);

  const preferred = byDifficulty
    .filter((topic) => categorySet.has(topic.category))
    .filter((topic) => !recentSet.has(topic.id));

  const rest = byDifficulty
    .filter((topic) => !categorySet.has(topic.category))
    .filter((topic) => !recentSet.has(topic.id));

  const pickRandom = (pool: Topic[]) => pool[Math.floor(Math.random() * pool.length)];

  if (preferred.length > 0) return pickRandom(preferred);
  if (rest.length > 0) return pickRandom(rest);
  return pickRandom(byDifficulty);
}

