import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================
// CONSTANTS
// ============================================================

const GEMINI_MODEL = "gemini-3.6-flash";

const COURSE_CATEGORIES = [
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Programming",
  "Data Structures",
  "Database",
  "DevOps",
  "Mobile Development",
  "Other",
];

const COURSE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const COURSE_AI_ACTIONS = [
  "improve_title",
  "generate_subtitle",
  "generate_description",
  "suggest_category",
  "suggest_level",
  "suggest_price",
  "generate_all",
  "review_course",
];

// ============================================================
// COMMON HELPERS
// ============================================================

const cleanText = (value, maxLength = 12000) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
};

const cleanConversationHistory = (history = []) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-12)
    .map((message) => ({
      role:
        message?.role === "assistant"
          ? "assistant"
          : "user",

      content: cleanText(message?.content, 4000),
    }))
    .filter((message) => message.content);
};

const createQuotaError = () => {
  const error = new Error(
    "Gemini API quota exceeded. Please try again later."
  );

  error.status = 429;
  error.statusCode = 429;
  error.code = "AI_QUOTA_EXCEEDED";

  return error;
};

const isQuotaError = (error) => {
  const status =
    error?.status ||
    error?.statusCode ||
    error?.response?.status;

  const message = String(
    error?.message || ""
  ).toLowerCase();

  return (
    status === 429 ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource exhausted") ||
    message.includes("too many requests")
  );
};

const cleanJsonResponse = (output) => {
  if (!output) {
    throw new Error("AI returned an empty response.");
  }

  let cleaned = String(output).trim();

  // Remove markdown code fences
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Extract JSON object if Gemini adds text around it
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Failed to parse Gemini JSON:",
      cleaned
    );

    throw new Error(
      "AI returned an invalid JSON response."
    );
  }
};

// ============================================================
// AI MENTOR
// ============================================================

export const askAIMentor = async ({
  question,
  courseTitle,
  category,
  level,
  lectureTitle,
  lectureContent,
  history = [],
}) => {
  try {
    const cleanQuestion = cleanText(question, 4000);

    const cleanCourseTitle = cleanText(
      courseTitle,
      300
    );

    const cleanCategory = cleanText(
      category,
      200
    );

    const cleanLevel = cleanText(
      level,
      100
    );

    const cleanLectureTitle = cleanText(
      lectureTitle,
      300
    );

    const cleanLectureContent = cleanText(
      lectureContent,
      12000
    );

    const cleanHistory =
      cleanConversationHistory(history);

    if (!cleanQuestion) {
      throw new Error(
        "Please enter a question."
      );
    }

    const systemInstruction = `
You are the Course AI Mentor inside Smart LMS.

Your PRIMARY responsibility is to help students understand
the current course and lecture.

============================================================
CORE CONTEXT RULE
============================================================

The supplied course and lecture information are the
SOURCE OF TRUTH.

Every answer MUST remain relevant to the current course.

If lecture content contains the answer, prioritize it.

If the lecture does not contain enough information,
you may provide general knowledge, but clearly distinguish
general knowledge from the supplied lecture content.

Never invent instructor statements.

Never claim that something was taught in the lecture
unless it actually appears in the supplied content.

============================================================
STRICT RULES
============================================================

1. Stay relevant to the current course.

2. Stay relevant to the current lecture whenever possible.

3. Do not introduce unrelated technologies.

4. Explain concepts clearly and naturally.

5. Use examples when they improve understanding.

6. Do not use emojis.

7. Do not invent course content.

8. If information is unavailable, say so clearly.

9. Do not make unsupported claims.

10. Be helpful to beginners while remaining technically correct.
`;

    const prompt = `
COURSE INFORMATION

Course:
${cleanCourseTitle}

Category:
${cleanCategory}

Level:
${cleanLevel}

CURRENT LECTURE

Lecture Title:
${cleanLectureTitle}

Lecture Content:
${cleanLectureContent}

PREVIOUS CONVERSATION

${JSON.stringify(
  cleanHistory,
  null,
  2
)}

STUDENT QUESTION

${cleanQuestion}

Answer the student's question using the lecture context
whenever possible.

If the lecture does not contain enough information,
clearly distinguish general knowledge from lecture content.
`;

    const response =
      await ai.interactions.create({
        model: GEMINI_MODEL,

        system_instruction:
          systemInstruction,

        input: prompt,

        generation_config: {
          temperature: 0.4,
          thinking_level: "low",
        },
      });

    const answer =
      response?.output_text ||
      response?.text ||
      response?.output ||
      "";

    if (!answer) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    return {
      answer: String(answer).trim(),
    };
  } catch (error) {
    console.error(
      "AI Mentor Error:",
      error
    );

    if (isQuotaError(error)) {
      throw createQuotaError();
    }

    throw error;
  }
};

// ============================================================
// MODULE QUIZ GENERATOR
// ============================================================

export const generateModuleQuiz = async ({
  moduleTitle,
  moduleDescription = "",
  lectures = [],
  questionCount = 10,
  passingScore = 70,
}) => {
  try {
    const cleanModuleTitle = cleanText(
      moduleTitle,
      300
    );

    const cleanModuleDescription =
      cleanText(
        moduleDescription,
        4000
      );

    const safeQuestionCount = Math.min(
      Math.max(
        Number(questionCount) || 10,
        5
      ),
      20
    );

    const safePassingScore = Math.min(
      Math.max(
        Number(passingScore) || 70,
        1
      ),
      100
    );

    if (!cleanModuleTitle) {
      throw new Error(
        "Module title is required."
      );
    }

    const lectureContext =
      Array.isArray(lectures)
        ? lectures
            .map((lecture, index) => {
              return `
LECTURE ${index + 1}

Title:
${cleanText(
  lecture?.lectureTitle,
  300
)}

Content:
${cleanText(
  lecture?.lectureContent,
  12000
)}
`;
            })
            .join("\n")
        : "";

    const systemInstruction = `
You are an expert educational quiz generator
for Smart LMS.

Generate a high-quality multiple-choice quiz
based ONLY on the supplied module and lecture content.

RULES:

1. Generate exactly ${safeQuestionCount} questions.

2. Every question must have exactly 4 options.

3. Exactly one option must be correct.

4. Questions should test understanding,
   not only memorization.

5. Avoid ambiguous questions.

6. Do not invent information outside
   the provided content.

7. Use simple and clear language.

8. Return ONLY valid JSON.

9. Do not use markdown.

10. The correctAnswer must exactly match
    one of the options.

11. passingScore must be ${safePassingScore}.
`;

    const prompt = `
MODULE

Title:
${cleanModuleTitle}

Description:
${cleanModuleDescription}

LECTURES

${lectureContext}

Generate the quiz using this JSON structure:

{
  "title": "Module Quiz",
  "description": "Short description",
  "passingScore": ${safePassingScore},
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option A",
      "explanation": "Short explanation"
    }
  ]
}
`;

    const response =
      await ai.interactions.create({
        model: GEMINI_MODEL,

        system_instruction:
          systemInstruction,

        input: prompt,

        generation_config: {
          temperature: 0.3,
          thinking_level: "low",
        },
      });

    const output =
      response?.output_text ||
      response?.text ||
      response?.output ||
      "";

    const result =
      cleanJsonResponse(output);

    if (
      !result ||
      !Array.isArray(result.questions)
    ) {
      throw new Error(
        "AI returned an invalid quiz structure."
      );
    }

    if (
      result.questions.length !==
      safeQuestionCount
    ) {
      throw new Error(
        `AI generated ${result.questions.length} questions instead of ${safeQuestionCount}.`
      );
    }

    result.questions =
      result.questions.map(
        (question) => {
          if (
            !question?.question ||
            !Array.isArray(
              question?.options
            ) ||
            question.options.length !== 4 ||
            !question.correctAnswer
          ) {
            throw new Error(
              "AI generated an invalid quiz question."
            );
          }

          if (
            !question.options.includes(
              question.correctAnswer
            )
          ) {
            throw new Error(
              "Quiz correctAnswer does not match any option."
            );
          }

          return {
            question: cleanText(
              question.question,
              1000
            ),

            options:
              question.options.map(
                (option) =>
                  cleanText(
                    option,
                    500
                  )
              ),

            correctAnswer:
              cleanText(
                question.correctAnswer,
                500
              ),

            explanation:
              cleanText(
                question.explanation,
                1000
              ),
          };
        }
      );

    return {
      title:
        cleanText(
          result.title,
          300
        ) || "Module Quiz",

      description:
        cleanText(
          result.description,
          1000
        ),

      passingScore:
        safePassingScore,

      questions:
        result.questions,
    };
  } catch (error) {
    console.error(
      "Module Quiz Generation Error:",
      error
    );

    if (isQuotaError(error)) {
      throw createQuotaError();
    }

    throw error;
  }
};

// ============================================================
// COURSE AI VALIDATION
// ============================================================

const validateCourseAIResponse = (
  result,
  action
) => {
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result)
  ) {
    throw new Error(
      "AI returned an invalid course response."
    );
  }

  const cleaned = {
    ...result,
  };

  // ----------------------------------------------------------
  // Text fields
  // ----------------------------------------------------------

  if (cleaned.title !== undefined) {
    cleaned.title = cleanText(
      cleaned.title,
      150
    );
  }

  if (cleaned.subtitle !== undefined) {
    cleaned.subtitle = cleanText(
      cleaned.subtitle,
      250
    );
  }

  if (
    cleaned.description !==
    undefined
  ) {
    cleaned.description =
      cleanText(
        cleaned.description,
        5000
      );
  }

  if (cleaned.summary !== undefined) {
    cleaned.summary = cleanText(
      cleaned.summary,
      2000
    );
  }

  if (
    cleaned.recommendation !==
    undefined
  ) {
    cleaned.recommendation =
      cleanText(
        cleaned.recommendation,
        2000
      );
  }

  // ----------------------------------------------------------
  // Category
  // ----------------------------------------------------------

  if (
    cleaned.category !==
    undefined
  ) {
    cleaned.category = cleanText(
      cleaned.category,
      100
    );

    if (
      !COURSE_CATEGORIES.includes(
        cleaned.category
      )
    ) {
      throw new Error(
        `AI returned an invalid course category: ${cleaned.category}`
      );
    }
  }

  // ----------------------------------------------------------
  // Level
  // ----------------------------------------------------------

  if (
    cleaned.level !==
    undefined
  ) {
    cleaned.level = cleanText(
      cleaned.level,
      50
    );

    if (
      !COURSE_LEVELS.includes(
        cleaned.level
      )
    ) {
      throw new Error(
        `AI returned an invalid course level: ${cleaned.level}`
      );
    }
  }

  // ----------------------------------------------------------
  // Price
  // ----------------------------------------------------------

  if (
    cleaned.price !==
    undefined
  ) {
    const price =
      Number(cleaned.price);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new Error(
        "AI returned an invalid course price."
      );
    }

    cleaned.price =
      Math.round(price);
  }

  // ----------------------------------------------------------
  // Review score
  // ----------------------------------------------------------

  if (
    cleaned.score !==
    undefined
  ) {
    const score =
      Number(cleaned.score);

    if (
      !Number.isFinite(score) ||
      score < 0 ||
      score > 100
    ) {
      throw new Error(
        "AI returned an invalid review score."
      );
    }

    cleaned.score =
      Math.round(score);
  }

  // ----------------------------------------------------------
  // Review arrays
  // ----------------------------------------------------------

  if (
    cleaned.strengths !==
    undefined
  ) {
    if (
      !Array.isArray(
        cleaned.strengths
      )
    ) {
      throw new Error(
        "AI returned invalid strengths."
      );
    }

    cleaned.strengths =
      cleaned.strengths
        .map((item) =>
          cleanText(item, 500)
        )
        .filter(Boolean);
  }

  if (
    cleaned.improvements !==
    undefined
  ) {
    if (
      !Array.isArray(
        cleaned.improvements
      )
    ) {
      throw new Error(
        "AI returned invalid improvements."
      );
    }

    cleaned.improvements =
      cleaned.improvements
        .map((item) =>
          cleanText(item, 500)
        )
        .filter(Boolean);
  }

  return cleaned;
};

// ============================================================
// ACTION-SPECIFIC VALIDATION
// ============================================================

const validateRequestedAction = (
  result,
  action
) => {
  switch (action) {
    case "improve_title": {
      if (!result.title) {
        throw new Error(
          "AI failed to generate a course title."
        );
      }

      break;
    }

    case "generate_subtitle": {
      if (!result.subtitle) {
        throw new Error(
          "AI failed to generate a course subtitle."
        );
      }

      break;
    }

    case "generate_description": {
      if (!result.description) {
        throw new Error(
          "AI failed to generate a course description."
        );
      }

      break;
    }

    case "suggest_category": {
      if (
        !COURSE_CATEGORIES.includes(
          result.category
        )
      ) {
        throw new Error(
          "AI failed to generate a valid course category."
        );
      }

      break;
    }

    case "suggest_level": {
      if (
        !COURSE_LEVELS.includes(
          result.level
        )
      ) {
        throw new Error(
          "AI failed to generate a valid course level."
        );
      }

      break;
    }

    case "suggest_price": {
      if (
        !Number.isFinite(
          result.price
        ) ||
        result.price < 0
      ) {
        throw new Error(
          "AI failed to generate a valid course price."
        );
      }

      break;
    }

    case "generate_all": {
      if (!result.title) {
        throw new Error(
          "AI failed to generate a course title."
        );
      }

      if (!result.subtitle) {
        throw new Error(
          "AI failed to generate a course subtitle."
        );
      }

      if (!result.description) {
        throw new Error(
          "AI failed to generate a course description."
        );
      }

      if (
        !COURSE_CATEGORIES.includes(
          result.category
        )
      ) {
        throw new Error(
          "AI failed to generate a valid course category."
        );
      }

      if (
        !COURSE_LEVELS.includes(
          result.level
        )
      ) {
        throw new Error(
          "AI failed to generate a valid course level."
        );
      }

      if (
        !Number.isFinite(
          result.price
        ) ||
        result.price < 0
      ) {
        throw new Error(
          "AI failed to generate a valid course price."
        );
      }

      break;
    }

    case "review_course": {
      if (
        !Number.isFinite(
          result.score
        ) ||
        result.score < 0 ||
        result.score > 100
      ) {
        throw new Error(
          "AI returned an invalid course review score."
        );
      }

      if (!result.summary) {
        throw new Error(
          "AI did not return a course review summary."
        );
      }

      if (
        !Array.isArray(
          result.strengths
        )
      ) {
        throw new Error(
          "AI did not return course strengths."
        );
      }

      if (
        !Array.isArray(
          result.improvements
        )
      ) {
        throw new Error(
          "AI did not return course improvements."
        );
      }

      if (!result.recommendation) {
        throw new Error(
          "AI did not return a course recommendation."
        );
      }

      break;
    }

    default:
      throw new Error(
        `Unsupported course AI action: ${action}`
      );
  }

  return result;
};

// ============================================================
// COURSE AI GENERATOR
// ============================================================

export const generateCourseSuggestions =
  async ({
    courseTitle = "",
    subTitle = "",
    description = "",
    category = "",
    courseLevel = "",
    coursePrice = "",
    action = "generate_all",
  }) => {
    try {
      // ------------------------------------------------------
      // Validate action
      // ------------------------------------------------------

      if (
        !COURSE_AI_ACTIONS.includes(
          action
        )
      ) {
        throw new Error(
          `Invalid course AI action: ${action}`
        );
      }

      // ------------------------------------------------------
      // Clean input
      // ------------------------------------------------------

      const cleanCourseTitle =
        cleanText(
          courseTitle,
          150
        );

      const cleanSubTitle =
        cleanText(
          subTitle,
          250
        );

      const cleanDescription =
        cleanText(
          description,
          5000
        );

      const cleanCategory =
        cleanText(
          category,
          100
        );

      const cleanCourseLevel =
        cleanText(
          courseLevel,
          50
        );

      const cleanCoursePrice =
        coursePrice === "" ||
        coursePrice === null ||
        coursePrice === undefined
          ? ""
          : Number(coursePrice);

      // ------------------------------------------------------
      // Strong system instruction
      // ------------------------------------------------------

      const systemInstruction = `
You are the Course AI Architect inside Smart LMS.

Your job is to help instructors create and improve online courses.

============================================================
MOST IMPORTANT RULE
============================================================

The instructor's existing course information is the
SOURCE OF TRUTH.

You MUST understand the actual subject of the course
before generating a response.

Every generated field MUST remain semantically connected
to the existing course.

NEVER silently change the subject of the course.

============================================================
SUBJECT PRESERVATION
============================================================

Preserve:

- programming language
- framework
- technology
- domain
- subject
- target learner
- learning goal
- important concepts

If the instructor provides a specific technology,
that technology must remain central.

For example:

Input:

"React.js for Beginners"

The generated course should remain about:

React.js
JavaScript
JSX
Components
Props
State
Hooks
Routing
Frontend development
React ecosystem

It MUST NOT become:

Python
Java
Spring Boot
Machine Learning
Data Science
Cybersecurity
DevOps
AWS

Another example:

Input:

"Java Data Structures and Algorithms"

Stay focused on:

Java
Data Structures
Algorithms
Problem Solving
Time Complexity
Space Complexity

Do NOT turn it into:

Python
React
MERN
Spring Boot
Machine Learning

Another example:

Input:

"MERN Stack Development"

Stay focused on:

MongoDB
Express.js
React
Node.js
REST APIs
Authentication
Full-stack web development

============================================================
STRICT RULES
============================================================

1. Preserve the original course subject.

2. Preserve explicitly mentioned technologies.

3. Never replace one technology with another.

4. Never introduce unrelated technologies.

5. Do not invent instructor credentials.

6. Do not invent certifications.

7. Do not invent salaries.

8. Do not invent job guarantees.

9. Do not invent companies.

10. Do not claim features that were not supplied.

11. Do not change the target learner without evidence.

12. Do not change the course level unless the requested
    action is suggest_level.

13. Do not change the category unless the requested
    action is suggest_category or generate_all.

14. When improving a field, preserve the meaning of
    the existing course.

15. Stay conservative when information is missing.

16. Avoid generic filler.

17. Do not use emojis.

18. Do not use markdown.

19. Return ONLY valid JSON.

20. Never return JSON inside markdown code fences.

21. Category MUST be one of the allowed categories.

22. Level MUST be one of the allowed levels.

23. Price MUST be a non-negative integer.

24. Review score MUST be between 0 and 100.

25. Semantic relevance is more important than creativity.

26. If creativity conflicts with topic preservation,
    ALWAYS preserve the topic.

============================================================
CATEGORY CLASSIFICATION
============================================================

Use these guidelines:

React, Vue, Angular, HTML, CSS, frontend UI,
frontend interfaces
-> Frontend Development

Node.js, Express.js, backend APIs, server-side development,
backend authentication
-> Backend Development

MERN, full-stack applications, frontend + backend
-> Full Stack Development

JavaScript, Java, Python, C++, general programming
-> Programming

Data Structures, Algorithms, DSA
-> Data Structures

MySQL, MongoDB, PostgreSQL, SQL, database design
-> Database

Docker, Kubernetes, CI/CD, deployment, infrastructure
-> DevOps

Flutter, React Native, Android, iOS, mobile apps
-> Mobile Development

General web technologies without a more specific category
-> Web Development

If none clearly applies
-> Other

Allowed categories:

${COURSE_CATEGORIES.join(", ")}

============================================================
LEVEL CLASSIFICATION
============================================================

Beginner:
Fundamentals and little previous knowledge.

Intermediate:
Assumes basic knowledge and teaches practical
moderately advanced concepts.

Advanced:
Advanced architecture, optimization, production systems,
or expert-level concepts.

Allowed levels:

${COURSE_LEVELS.join(", ")}
`;

      // ------------------------------------------------------
      // Course context
      // ------------------------------------------------------

      const courseContext = `
CURRENT COURSE DATA

Title:
${cleanCourseTitle || "(empty)"}

Subtitle:
${cleanSubTitle || "(empty)"}

Description:
${cleanDescription || "(empty)"}

Category:
${cleanCategory || "(empty)"}

Level:
${cleanCourseLevel || "(empty)"}

Price:
${
  cleanCoursePrice === ""
    ? "(empty)"
    : cleanCoursePrice
}
`;

      // ------------------------------------------------------
      // Action instructions
      // ------------------------------------------------------

      let actionInstruction = "";

      switch (action) {
        case "improve_title":
          actionInstruction = `
Improve ONLY the existing course title.

Requirements:

- Preserve the original subject.
- Preserve important technologies.
- Keep the same learning area.
- Make it clearer.
- Make it professional.
- Make it specific.
- Make it attractive to the correct learner.
- Do not introduce unrelated technologies.
- Do not create a different course.

Return exactly:

{
  "title": "Improved course title"
}
`;
          break;

        case "generate_subtitle":
          actionInstruction = `
Generate ONLY the course subtitle.

The subtitle MUST:

- relate directly to the course title
- describe the same subject
- explain the learning value
- communicate a realistic outcome
- remain concise

Do not introduce unrelated technologies.

Return exactly:

{
  "subtitle": "Course subtitle"
}
`;
          break;

        case "generate_description":
          actionInstruction = `
Generate ONLY the course description.

The description MUST:

- remain about the existing course subject
- explain what students will learn
- explain who the course is for
- mention relevant skills
- mention practical outcomes
- preserve explicitly mentioned technologies

Do not invent unrelated technologies.

Do not invent certifications or credentials.

Return exactly:

{
  "description": "Course description"
}
`;
          break;

        case "suggest_category":
          actionInstruction = `
Choose the SINGLE most appropriate category.

Analyze:

- title
- subtitle
- description
- existing category

The category must represent the actual subject.

Allowed categories:

${COURSE_CATEGORIES.join(", ")}

Return exactly:

{
  "category": "One allowed category"
}
`;
          break;

        case "suggest_level":
          actionInstruction = `
Choose the SINGLE most appropriate level.

Analyze:

- title
- subtitle
- description
- existing level

Allowed levels:

${COURSE_LEVELS.join(", ")}

Return exactly:

{
  "level": "Beginner"
}

or:

{
  "level": "Intermediate"
}

or:

{
  "level": "Advanced"
}
`;
          break;

        case "suggest_price":
          actionInstruction = `
Suggest a reasonable course price in Indian Rupees.

Consider:

- actual course subject
- target learner
- difficulty
- depth
- practical value
- perceived educational value

Pricing must NOT change the course topic.

Return exactly:

{
  "price": 1499
}

The price must be a non-negative integer.
`;
          break;

        case "generate_all":
          actionInstruction = `
Create a complete course draft.

First identify the PRIMARY SUBJECT from the supplied
course title, subtitle, description and category.

Then generate:

- title
- subtitle
- description
- category
- level
- price

CRITICAL:

All six fields MUST describe the SAME course subject.

The generated title must preserve the original topic.

The subtitle must describe the same topic.

The description must describe the same topic.

The category must represent the same topic.

The level must match the supplied difficulty.

The price should reflect the course value.

DO NOT introduce unrelated technologies.

DO NOT transform one technology into another.

Example:

Input:

Title:
React.js for Beginners

Category:
Frontend Development

Level:
Beginner

Acceptable title:

"Complete React.js Beginner Course"

"React.js Fundamentals: Build Modern Web Interfaces"

Unacceptable:

"Complete Python Data Science Course"

"Master Java Spring Boot"

"Full Stack DevOps Bootcamp"

Another example:

Input:

Title:
Java Data Structures and Algorithms

Acceptable:

"Java DSA: Data Structures and Algorithms"

Unacceptable:

"Python Machine Learning Masterclass"

Return exactly:

{
  "title": "Course title",
  "subtitle": "Course subtitle",
  "description": "Course description",
  "category": "Frontend Development",
  "level": "Beginner",
  "price": 1499
}
`;
          break;

        case "review_course":
          actionInstruction = `
Review the current course draft.

Evaluate:

- title clarity
- subtitle quality
- description quality
- category fit
- level fit
- pricing
- learner value
- overall completeness

The review MUST be based only on the supplied course.

Do not change the course topic.

The score is a heuristic AI assessment and is NOT an
objective market rating.

Return exactly:

{
  "score": 85,
  "summary": "Short overall assessment",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "recommendation": "What the instructor should improve next"
}
`;
          break;

        default:
          throw new Error(
            `Unsupported course AI action: ${action}`
          );
      }

      // ------------------------------------------------------
      // Final prompt
      // ------------------------------------------------------

      const prompt = `
${courseContext}

REQUESTED AI ACTION:

${actionInstruction}

FINAL CHECK BEFORE RESPONDING:

1. Is the generated content about the SAME course subject?
2. Did you preserve the important technologies?
3. Did you avoid unrelated technologies?
4. Is the category valid?
5. Is the level valid?
6. Is the price a non-negative integer?
7. Is the response valid JSON?

If any generated field changes the course subject,
correct it before responding.

Return ONLY valid JSON.
`;

      // ------------------------------------------------------
      // Gemini request
      // ------------------------------------------------------

      const response =
        await ai.interactions.create({
          model: GEMINI_MODEL,

          system_instruction:
            systemInstruction,

          input: prompt,

          generation_config: {
            temperature: 0.25,
            thinking_level: "low",
          },
        });

      const output =
        response?.output_text ||
        response?.text ||
        response?.output ||
        "";

      // ------------------------------------------------------
      // Parse JSON
      // ------------------------------------------------------

      const parsed =
        cleanJsonResponse(output);

      // ------------------------------------------------------
      // General validation
      // ------------------------------------------------------

      const validated =
        validateCourseAIResponse(
          parsed,
          action
        );

      // ------------------------------------------------------
      // Action-specific validation
      // ------------------------------------------------------

      const finalResult =
        validateRequestedAction(
          validated,
          action
        );

      return finalResult;
    } catch (error) {
      console.error(
        "Course AI Architect Error:",
        error
      );

      if (isQuotaError(error)) {
        throw createQuotaError();
      }

      throw error;
    }
  };