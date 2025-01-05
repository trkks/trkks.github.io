const data = {
    // These are indexes to words on rows.
    "columns": ["english", "finnish", "russian"],
    // It's easier on the eyes to write the words in a 1-dimensional array.
    "words": [
        // Numbers:
        "one", "yksi", "один",
        "two", "kaksi", "два",
        "three", "kolme", "три",
        "four", "neljä", "четыре",
        "five", "viisi", "пять",
        "six", "kuusi", "шесть",
        "seven", "seitsemän", "семь",
        "eight", "kahdeksan", "восемь",
        "nine", "yhdeksän", "девять",
        "ten", "kymmenen", "десять",
        // Animals:
        "dog", "koira", "собака",
        "cat", "kissa", "кошка",
        "cow", "lehmä", "корова",
        "pig", "sika", "свинья",
        "mouse", "hiiri", "мышь",
        // Greetings:
        "good morning", "hyvää huomenta", "доброе утро",
        // Misc:
        null, "aamiainen", "завтрак",
        null, "aamu", "утро",
        null, "aamulla", "утром",
        null, "aihe", "тема",
        // TODO: Handle synonyms like these:
        null, "aika", "время",
        null, "aika", "пора",
        null, "aikaisemmin", "раньще",
        null, "aikaisin", "рано",
        null, "aikakauslehti", "журнал",
        null, "aikataulu", "расписание",
        null, "aina", "всегда",
        null, "ainoastaan", "только",
    ]
};
