// Dibuat otomatis oleh tools/build-schemas.mjs dari schema/*.schema.json. Jangan diedit langsung.
export const SCHEMAS = {
  "batch.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "batch.schema.json",
    "title": "Batch soal dari penyusun AI (SPEC 5.3)",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "batchType",
      "schemaVersion",
      "subjectId",
      "batchId",
      "items"
    ],
    "properties": {
      "batchType": {
        "const": "soal"
      },
      "schemaVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "subjectId": {
        "$ref": "common.schema.json#/$defs/subjectId"
      },
      "batchId": {
        "type": "string",
        "pattern": "^[A-Z][A-Z0-9]*-B[0-9]{2,}$"
      },
      "items": {
        "type": "array",
        "minItems": 1,
        "maxItems": 10,
        "items": {
          "allOf": [
            {
              "$ref": "question.schema.json"
            },
            {
              "$comment": "Soal dari AI selalu DRAFT (atau CALIBRATION), tanpa hash, tanpa review/persetujuan.",
              "properties": {
                "lifecycle": {
                  "properties": {
                    "status": {
                      "enum": [
                        "DRAFT",
                        "CALIBRATION"
                      ]
                    },
                    "contentHash": {
                      "const": ""
                    },
                    "review": {
                      "type": "null"
                    },
                    "approvedBy": {
                      "type": "null"
                    },
                    "approvedAt": {
                      "type": "null"
                    },
                    "history": false
                  }
                }
              }
            }
          ]
        }
      }
    }
  },
  "common.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "common.schema.json",
    "title": "Definisi bersama kontrak data Simulator Ujian CA v4.1",
    "$comment": "Pustaka $defs saja; tidak memvalidasi dokumen secara langsung.",
    "$defs": {
      "schemaVersion": {
        "const": "4.1"
      },
      "nonEmptyString": {
        "type": "string",
        "minLength": 1
      },
      "subjectId": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9_-]{1,31}$"
      },
      "questionId": {
        "type": "string",
        "pattern": "^[A-Z][A-Z0-9]*-[A-Z]+-[0-9]{3,}$",
        "description": "Contoh: MSK-MCQ-001. Lihat DECISIONS.md untuk prefiks tipe."
      },
      "topicId": {
        "type": "string",
        "pattern": "^T[0-9]{2}$"
      },
      "competencyId": {
        "type": "string",
        "pattern": "^K[0-9]{2}$"
      },
      "criterionId": {
        "type": "string",
        "pattern": "^C[0-9]{1,2}$"
      },
      "subQuestionId": {
        "type": "string",
        "pattern": "^[a-z]$"
      },
      "sessionId": {
        "type": "string",
        "pattern": "^[A-Za-z0-9_-]{8,64}$"
      },
      "packageId": {
        "type": "string",
        "pattern": "^[A-Z][A-Z0-9_]{0,15}$"
      },
      "questionType": {
        "enum": [
          "mcq",
          "essay",
          "case",
          "numeric"
        ]
      },
      "caseSize": {
        "enum": [
          "mini",
          "komprehensif"
        ]
      },
      "difficulty": {
        "enum": [
          "mudah",
          "sedang",
          "sulit",
          "sangat_sulit"
        ]
      },
      "cognitiveLevel": {
        "enum": [
          "C2",
          "C3",
          "C4",
          "C5",
          "C6"
        ]
      },
      "optionKey": {
        "enum": [
          "A",
          "B",
          "C",
          "D"
        ]
      },
      "confidence": {
        "enum": [
          "tinggi",
          "sedang",
          "rendah"
        ]
      },
      "verdict": {
        "enum": [
          "APPROVE",
          "REVISE",
          "REJECT"
        ]
      },
      "dimensionName": {
        "enum": [
          "keyCorrectness",
          "singleBestAnswer",
          "stemClarity",
          "distractorQuality",
          "rubricQuality",
          "dataConsistency",
          "alignment",
          "timeEstimate",
          "originality",
          "fairness"
        ]
      },
      "lifecycleStatus": {
        "enum": [
          "DRAFT",
          "AI_REVIEWED",
          "APPROVED",
          "LIVE",
          "NEEDS_REVISION",
          "REJECTED",
          "RETIRED",
          "CALIBRATION"
        ]
      },
      "score": {
        "type": "number",
        "minimum": 0,
        "multipleOf": 0.5,
        "description": "Skor skala asli, kelipatan 0,5."
      },
      "positiveScore": {
        "type": "number",
        "exclusiveMinimum": 0,
        "multipleOf": 0.5
      },
      "sha256": {
        "type": "string",
        "pattern": "^[0-9a-f]{64}$"
      },
      "semver": {
        "type": "string",
        "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$"
      },
      "date": {
        "type": "string",
        "format": "date"
      },
      "dateTime": {
        "type": "string",
        "format": "date-time"
      },
      "nullableDateTime": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "string",
            "format": "date-time"
          }
        ]
      }
    }
  },
  "grading-export.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "grading-export.schema.json",
    "title": "Paket penilaian yang diekspor aplikasi untuk AI penilai (SPEC 5.5)",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "gradingVersion",
      "sessionId",
      "subjectId",
      "packVersion",
      "answersChecksum",
      "items"
    ],
    "properties": {
      "gradingVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "sessionId": {
        "$ref": "common.schema.json#/$defs/sessionId"
      },
      "subjectId": {
        "$ref": "common.schema.json#/$defs/subjectId"
      },
      "packVersion": {
        "$ref": "common.schema.json#/$defs/semver"
      },
      "answersChecksum": {
        "$ref": "common.schema.json#/$defs/sha256",
        "description": "SHA-256 atas JSON array [questionId, answer] terurut questionId (lihat CONTRACT.md)."
      },
      "items": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/gradingItem"
        }
      }
    },
    "$defs": {
      "gradingItem": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "questionId",
          "type",
          "stem",
          "maxScore",
          "acceptableAlternatives",
          "answer",
          "isBlank"
        ],
        "properties": {
          "questionId": {
            "$ref": "common.schema.json#/$defs/questionId"
          },
          "type": {
            "enum": [
              "essay",
              "case"
            ]
          },
          "stem": {
            "$ref": "question.schema.json#/properties/stem"
          },
          "caseNarrative": {
            "$ref": "question.schema.json#/properties/caseNarrative"
          },
          "caseData": {
            "$ref": "question.schema.json#/properties/caseData"
          },
          "subQuestions": {
            "$ref": "question.schema.json#/properties/subQuestions"
          },
          "maxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "rubric": {
            "$ref": "question.schema.json#/properties/rubric"
          },
          "modelAnswer": {
            "$ref": "question.schema.json#/properties/modelAnswer"
          },
          "acceptableAlternatives": {
            "$ref": "question.schema.json#/properties/acceptableAlternatives"
          },
          "answer": {
            "type": "string",
            "description": "Teks asli peserta. Kasus: jawaban tiap sub-pertanyaan digabung dengan label [a], [b], ..."
          },
          "isBlank": {
            "type": "boolean"
          }
        },
        "allOf": [
          {
            "if": {
              "properties": {
                "type": {
                  "const": "essay"
                }
              },
              "required": [
                "type"
              ]
            },
            "then": {
              "required": [
                "rubric",
                "modelAnswer"
              ],
              "properties": {
                "maxScore": {
                  "const": 10
                },
                "caseNarrative": false,
                "caseData": false,
                "subQuestions": false
              }
            }
          },
          {
            "if": {
              "properties": {
                "type": {
                  "const": "case"
                }
              },
              "required": [
                "type"
              ]
            },
            "then": {
              "required": [
                "caseNarrative",
                "subQuestions"
              ],
              "properties": {
                "maxScore": {
                  "const": 20
                },
                "rubric": false
              }
            }
          }
        ]
      }
    }
  },
  "grading-result.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "grading-result.schema.json",
    "title": "Hasil penilaian dari AI penilai (SPEC 5.5, Prompt D)",
    "$comment": "Skema memeriksa bentuk. Batas skor <= maks, kelengkapan, dan jumlah kriteria diperiksa saat impor (SPEC 10).",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "gradingVersion",
      "sessionId",
      "answersChecksum",
      "graderModel",
      "evaluatedQuestionIds",
      "scores",
      "reviewFlags",
      "overallFeedback"
    ],
    "properties": {
      "gradingVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "sessionId": {
        "$ref": "common.schema.json#/$defs/sessionId"
      },
      "answersChecksum": {
        "$ref": "common.schema.json#/$defs/sha256"
      },
      "graderModel": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "evaluatedQuestionIds": {
        "type": "array",
        "minItems": 1,
        "uniqueItems": true,
        "items": {
          "$ref": "common.schema.json#/$defs/questionId"
        }
      },
      "scores": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/questionScore"
        }
      },
      "reviewFlags": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/reviewFlag"
        }
      },
      "overallFeedback": {
        "type": "string"
      }
    },
    "$defs": {
      "criterionScore": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "criterionId",
          "maxScore",
          "awardedScore",
          "justification"
        ],
        "properties": {
          "criterionId": {
            "$ref": "common.schema.json#/$defs/criterionId"
          },
          "maxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "awardedScore": {
            "$ref": "common.schema.json#/$defs/score"
          },
          "justification": {
            "type": "string"
          }
        }
      },
      "subQuestionScore": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "subId",
          "maxScore",
          "awardedScore",
          "criteriaScores"
        ],
        "properties": {
          "subId": {
            "$ref": "common.schema.json#/$defs/subQuestionId"
          },
          "maxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "awardedScore": {
            "$ref": "common.schema.json#/$defs/score"
          },
          "criteriaScores": {
            "type": "array",
            "minItems": 1,
            "items": {
              "$ref": "#/$defs/criterionScore"
            }
          }
        }
      },
      "questionScore": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "questionId",
          "maxScore",
          "awardedScore",
          "criteriaScores",
          "subQuestionScores",
          "strengths",
          "weaknesses",
          "improvement",
          "confidence"
        ],
        "properties": {
          "questionId": {
            "$ref": "common.schema.json#/$defs/questionId"
          },
          "maxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "awardedScore": {
            "$ref": "common.schema.json#/$defs/score"
          },
          "criteriaScores": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/criterionScore"
            }
          },
          "subQuestionScores": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/subQuestionScore"
            }
          },
          "strengths": {
            "type": "string"
          },
          "weaknesses": {
            "type": "string"
          },
          "improvement": {
            "type": "string"
          },
          "confidence": {
            "$ref": "common.schema.json#/$defs/confidence"
          }
        }
      },
      "reviewFlag": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "questionId",
          "type",
          "note"
        ],
        "properties": {
          "questionId": {
            "$ref": "common.schema.json#/$defs/questionId"
          },
          "type": {
            "enum": [
              "jawaban_kosong",
              "soal_bermasalah",
              "ketidakpastian_tinggi",
              "instruksi_dalam_jawaban"
            ]
          },
          "note": {
            "type": "string"
          }
        }
      }
    }
  },
  "pack.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "pack.schema.json",
    "title": "Subject Pack (SPEC 5.1 dan 6)",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "schemaVersion",
      "subjectId",
      "subjectName",
      "packVersion",
      "language",
      "passingGrade",
      "topics",
      "competencies",
      "packages",
      "questions",
      "changelog"
    ],
    "properties": {
      "schemaVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "subjectId": {
        "$ref": "common.schema.json#/$defs/subjectId"
      },
      "subjectName": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "packVersion": {
        "$ref": "common.schema.json#/$defs/semver"
      },
      "language": {
        "enum": [
          "id"
        ]
      },
      "passingGrade": {
        "type": "number",
        "minimum": 0,
        "maximum": 100
      },
      "topics": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/topic"
        }
      },
      "competencies": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/competency"
        }
      },
      "packages": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/package"
        }
      },
      "questions": {
        "type": "array",
        "items": {
          "$ref": "question.schema.json"
        }
      },
      "changelog": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/changelogEntry"
        }
      }
    },
    "$defs": {
      "topic": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name"
        ],
        "properties": {
          "id": {
            "$ref": "common.schema.json#/$defs/topicId"
          },
          "name": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          }
        }
      },
      "competency": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name"
        ],
        "properties": {
          "id": {
            "$ref": "common.schema.json#/$defs/competencyId"
          },
          "name": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          }
        }
      },
      "changelogEntry": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "version",
          "date",
          "notes"
        ],
        "properties": {
          "version": {
            "$ref": "common.schema.json#/$defs/semver"
          },
          "date": {
            "$ref": "common.schema.json#/$defs/date"
          },
          "notes": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          }
        }
      },
      "package": {
        "$comment": "Blueprint paket ujian (SPEC 6). Bobot bagian menjumlah 100 (diperiksa aturan konsistensi).",
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "durationMinutes",
          "strictMode",
          "sections",
          "difficultyTarget",
          "coverage"
        ],
        "properties": {
          "id": {
            "$ref": "common.schema.json#/$defs/packageId"
          },
          "name": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "durationMinutes": {
            "type": "integer",
            "minimum": 1,
            "maximum": 600
          },
          "strictMode": {
            "type": "boolean"
          },
          "sections": {
            "type": "array",
            "minItems": 1,
            "items": {
              "$ref": "#/$defs/section"
            }
          },
          "suggestedMinutes": {
            "type": "object",
            "propertyNames": {
              "$ref": "common.schema.json#/$defs/questionType"
            },
            "additionalProperties": {
              "type": "integer",
              "minimum": 0
            }
          },
          "difficultyTarget": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "levels",
              "minScoreShare"
            ],
            "properties": {
              "levels": {
                "type": "array",
                "minItems": 1,
                "uniqueItems": true,
                "items": {
                  "$ref": "common.schema.json#/$defs/difficulty"
                }
              },
              "minScoreShare": {
                "type": "number",
                "minimum": 0,
                "maximum": 1
              }
            }
          },
          "coverage": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "minTopics",
              "maxTopicScoreShare"
            ],
            "properties": {
              "minTopics": {
                "type": "integer",
                "minimum": 1
              },
              "maxTopicScoreShare": {
                "type": "number",
                "exclusiveMinimum": 0,
                "maximum": 1
              }
            }
          }
        }
      },
      "section": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "type",
          "count",
          "weight"
        ],
        "properties": {
          "type": {
            "$ref": "common.schema.json#/$defs/questionType"
          },
          "count": {
            "type": "integer",
            "minimum": 1
          },
          "caseSize": {
            "$ref": "common.schema.json#/$defs/caseSize"
          },
          "weight": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "multipleOf": 0.01,
            "description": "Total skor bagian dalam paket (skala 100)."
          },
          "itemScores": {
            "type": "array",
            "items": {
              "type": "number",
              "exclusiveMinimum": 0,
              "multipleOf": 0.01
            },
            "description": "Opsional: skor per butir bila tidak dibagi rata (contoh SIM kasus 16 dan 17)."
          }
        },
        "if": {
          "properties": {
            "type": {
              "const": "case"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "required": [
            "caseSize"
          ]
        },
        "else": {
          "properties": {
            "caseSize": false
          }
        }
      }
    }
  },
  "question.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "question.schema.json",
    "title": "Soal (SPEC 5.2)",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "id",
      "type",
      "topicIds",
      "competencyIds",
      "difficulty",
      "cognitiveLevel",
      "estimatedMinutes",
      "maxScore",
      "stem",
      "lifecycle",
      "authoring"
    ],
    "properties": {
      "id": {
        "$ref": "common.schema.json#/$defs/questionId"
      },
      "type": {
        "$ref": "common.schema.json#/$defs/questionType"
      },
      "caseSize": {
        "$ref": "common.schema.json#/$defs/caseSize"
      },
      "topicIds": {
        "type": "array",
        "minItems": 1,
        "uniqueItems": true,
        "items": {
          "$ref": "common.schema.json#/$defs/topicId"
        }
      },
      "competencyIds": {
        "type": "array",
        "minItems": 1,
        "uniqueItems": true,
        "items": {
          "$ref": "common.schema.json#/$defs/competencyId"
        }
      },
      "difficulty": {
        "$ref": "common.schema.json#/$defs/difficulty"
      },
      "cognitiveLevel": {
        "$ref": "common.schema.json#/$defs/cognitiveLevel"
      },
      "estimatedMinutes": {
        "type": "number",
        "exclusiveMinimum": 0,
        "maximum": 240
      },
      "maxScore": {
        "$ref": "common.schema.json#/$defs/positiveScore"
      },
      "stem": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "options": {
        "type": "array",
        "minItems": 4,
        "maxItems": 4,
        "items": {
          "$ref": "#/$defs/option"
        }
      },
      "answerKey": {
        "$ref": "common.schema.json#/$defs/optionKey"
      },
      "distractorRationale": {
        "type": "object",
        "minProperties": 3,
        "maxProperties": 3,
        "propertyNames": {
          "$ref": "common.schema.json#/$defs/optionKey"
        },
        "additionalProperties": {
          "$ref": "common.schema.json#/$defs/nonEmptyString"
        }
      },
      "numericAnswer": {
        "$ref": "#/$defs/numericAnswer"
      },
      "caseNarrative": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "caseData": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/caseTable"
        }
      },
      "subQuestions": {
        "type": "array",
        "minItems": 1,
        "maxItems": 8,
        "items": {
          "$ref": "#/$defs/subQuestion"
        }
      },
      "explanation": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "modelAnswer": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "rubric": {
        "$ref": "#/$defs/rubric"
      },
      "acceptableAlternatives": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "references": {
        "type": "array",
        "items": {
          "$ref": "common.schema.json#/$defs/nonEmptyString"
        }
      },
      "lifecycle": {
        "$ref": "#/$defs/lifecycle"
      },
      "authoring": {
        "$ref": "#/$defs/authoring"
      },
      "calibration": {
        "$ref": "#/$defs/calibration"
      }
    },
    "allOf": [
      {
        "$ref": "#/$defs/typeRules"
      }
    ],
    "$defs": {
      "option": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "key",
          "text"
        ],
        "properties": {
          "key": {
            "$ref": "common.schema.json#/$defs/optionKey"
          },
          "text": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          }
        }
      },
      "numericAnswer": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "value",
          "unit",
          "tolerance"
        ],
        "properties": {
          "value": {
            "type": "number"
          },
          "unit": {
            "type": "string"
          },
          "tolerance": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "type",
              "value"
            ],
            "properties": {
              "type": {
                "enum": [
                  "absolute",
                  "relative"
                ]
              },
              "value": {
                "type": "number",
                "minimum": 0,
                "description": "absolute: selisih maksimum dalam satuan jawaban; relative: pecahan (0.01 = 1%)."
              }
            }
          }
        }
      },
      "rubricCriterion": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "criterionId",
          "description",
          "maxScore",
          "full",
          "partial",
          "zero"
        ],
        "properties": {
          "criterionId": {
            "$ref": "common.schema.json#/$defs/criterionId"
          },
          "description": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "maxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "full": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "partial": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "zero": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          }
        }
      },
      "rubric": {
        "type": "array",
        "minItems": 3,
        "maxItems": 6,
        "items": {
          "$ref": "#/$defs/rubricCriterion"
        }
      },
      "caseTable": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "title",
          "columns",
          "rows"
        ],
        "properties": {
          "title": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "columns": {
            "type": "array",
            "minItems": 1,
            "items": {
              "$ref": "common.schema.json#/$defs/nonEmptyString"
            }
          },
          "rows": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "array",
              "items": {
                "type": [
                  "string",
                  "number"
                ]
              }
            }
          }
        }
      },
      "subQuestion": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "prompt",
          "maxScore",
          "modelAnswer",
          "rubric"
        ],
        "properties": {
          "id": {
            "$ref": "common.schema.json#/$defs/subQuestionId"
          },
          "prompt": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "maxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "modelAnswer": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "rubric": {
            "$ref": "#/$defs/rubric"
          }
        }
      },
      "lifecycle": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "status",
          "contentHash",
          "review",
          "approvedBy",
          "approvedAt"
        ],
        "properties": {
          "status": {
            "$ref": "common.schema.json#/$defs/lifecycleStatus"
          },
          "contentHash": {
            "type": "string",
            "pattern": "^([0-9a-f]{64})?$",
            "description": "Kosong dari AI; diisi aplikasi (SHA-256 heksadesimal huruf kecil)."
          },
          "review": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "$ref": "#/$defs/reviewRecord"
              }
            ]
          },
          "approvedBy": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "$ref": "common.schema.json#/$defs/nonEmptyString"
              }
            ]
          },
          "approvedAt": {
            "$ref": "common.schema.json#/$defs/nullableDateTime"
          },
          "history": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/statusTransition"
            }
          }
        }
      },
      "statusTransition": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "from",
          "to",
          "at"
        ],
        "properties": {
          "from": {
            "$ref": "common.schema.json#/$defs/lifecycleStatus"
          },
          "to": {
            "$ref": "common.schema.json#/$defs/lifecycleStatus"
          },
          "at": {
            "$ref": "common.schema.json#/$defs/dateTime"
          },
          "by": {
            "type": "string"
          },
          "reason": {
            "type": "string"
          }
        }
      },
      "reviewRecord": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "batchId",
          "reviewerModel",
          "reviewedAt",
          "result"
        ],
        "properties": {
          "batchId": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "reviewerModel": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "reviewedAt": {
            "$ref": "common.schema.json#/$defs/dateTime"
          },
          "result": {
            "$ref": "review-result.schema.json#/$defs/reviewItem"
          }
        }
      },
      "authoring": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "createdBy",
          "createdAt",
          "revision"
        ],
        "properties": {
          "createdBy": {
            "enum": [
              "AI",
              "manusia"
            ]
          },
          "model": {
            "type": "string"
          },
          "createdAt": {
            "anyOf": [
              {
                "$ref": "common.schema.json#/$defs/date"
              },
              {
                "$ref": "common.schema.json#/$defs/dateTime"
              }
            ]
          },
          "revision": {
            "type": "integer",
            "minimum": 1
          },
          "notes": {
            "type": "string"
          }
        },
        "if": {
          "properties": {
            "createdBy": {
              "const": "AI"
            }
          },
          "required": [
            "createdBy"
          ]
        },
        "then": {
          "required": [
            "model"
          ],
          "properties": {
            "model": {
              "minLength": 1
            }
          }
        }
      },
      "calibration": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "defectDimension",
          "defectDescription",
          "expectedVerdict"
        ],
        "properties": {
          "defectDimension": {
            "$ref": "common.schema.json#/$defs/dimensionName"
          },
          "defectDescription": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "expectedVerdict": {
            "enum": [
              "REVISE",
              "REJECT"
            ]
          }
        }
      },
      "typeRules": {
        "$comment": "Field wajib dan terlarang per tipe soal. Dipakai juga oleh review-export.",
        "allOf": [
          {
            "if": {
              "properties": {
                "type": {
                  "const": "mcq"
                }
              },
              "required": [
                "type"
              ]
            },
            "then": {
              "required": [
                "options",
                "answerKey",
                "distractorRationale",
                "explanation"
              ],
              "properties": {
                "maxScore": {
                  "const": 1
                },
                "caseSize": false,
                "numericAnswer": false,
                "caseNarrative": false,
                "caseData": false,
                "subQuestions": false,
                "rubric": false
              }
            }
          },
          {
            "if": {
              "properties": {
                "type": {
                  "const": "numeric"
                }
              },
              "required": [
                "type"
              ]
            },
            "then": {
              "required": [
                "numericAnswer",
                "explanation"
              ],
              "properties": {
                "maxScore": {
                  "const": 1
                },
                "caseSize": false,
                "options": false,
                "answerKey": false,
                "distractorRationale": false,
                "caseNarrative": false,
                "caseData": false,
                "subQuestions": false,
                "rubric": false
              }
            }
          },
          {
            "if": {
              "properties": {
                "type": {
                  "const": "essay"
                }
              },
              "required": [
                "type"
              ]
            },
            "then": {
              "required": [
                "rubric",
                "modelAnswer",
                "acceptableAlternatives"
              ],
              "properties": {
                "maxScore": {
                  "const": 10
                },
                "caseSize": false,
                "options": false,
                "answerKey": false,
                "distractorRationale": false,
                "numericAnswer": false,
                "caseNarrative": false,
                "caseData": false,
                "subQuestions": false
              }
            }
          },
          {
            "if": {
              "properties": {
                "type": {
                  "const": "case"
                }
              },
              "required": [
                "type"
              ]
            },
            "then": {
              "required": [
                "caseSize",
                "caseNarrative",
                "subQuestions",
                "acceptableAlternatives"
              ],
              "properties": {
                "maxScore": {
                  "const": 20
                },
                "options": false,
                "answerKey": false,
                "distractorRationale": false,
                "numericAnswer": false,
                "rubric": false
              }
            }
          }
        ]
      }
    }
  },
  "review-export.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "review-export.schema.json",
    "title": "Paket review yang diekspor aplikasi untuk AI reviewer (SPEC 5.4)",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "reviewVersion",
      "batchId",
      "subjectName",
      "topics",
      "competencies",
      "items"
    ],
    "properties": {
      "reviewVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "batchId": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "subjectName": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "topics": {
        "$ref": "pack.schema.json#/properties/topics"
      },
      "competencies": {
        "$ref": "pack.schema.json#/properties/competencies"
      },
      "items": {
        "type": "array",
        "minItems": 1,
        "maxItems": 11,
        "$comment": "Maks 10 soal PG (5 esai, 2 kasus) + 1 soal kalibrasi.",
        "items": {
          "$ref": "#/$defs/reviewItem"
        }
      }
    },
    "$defs": {
      "reviewItem": {
        "$comment": "Soal tanpa id, lifecycle, authoring, calibration; diganti reviewKey + contentHash.",
        "type": "object",
        "additionalProperties": false,
        "required": [
          "reviewKey",
          "contentHash",
          "type",
          "topicIds",
          "competencyIds",
          "difficulty",
          "cognitiveLevel",
          "estimatedMinutes",
          "maxScore",
          "stem"
        ],
        "properties": {
          "reviewKey": {
            "type": "string",
            "pattern": "^R[0-9]{2,}$"
          },
          "contentHash": {
            "$ref": "common.schema.json#/$defs/sha256"
          },
          "type": {
            "$ref": "question.schema.json#/properties/type"
          },
          "caseSize": {
            "$ref": "question.schema.json#/properties/caseSize"
          },
          "topicIds": {
            "$ref": "question.schema.json#/properties/topicIds"
          },
          "competencyIds": {
            "$ref": "question.schema.json#/properties/competencyIds"
          },
          "difficulty": {
            "$ref": "question.schema.json#/properties/difficulty"
          },
          "cognitiveLevel": {
            "$ref": "question.schema.json#/properties/cognitiveLevel"
          },
          "estimatedMinutes": {
            "$ref": "question.schema.json#/properties/estimatedMinutes"
          },
          "maxScore": {
            "$ref": "question.schema.json#/properties/maxScore"
          },
          "stem": {
            "$ref": "question.schema.json#/properties/stem"
          },
          "options": {
            "$ref": "question.schema.json#/properties/options"
          },
          "answerKey": {
            "$ref": "question.schema.json#/properties/answerKey"
          },
          "distractorRationale": {
            "$ref": "question.schema.json#/properties/distractorRationale"
          },
          "numericAnswer": {
            "$ref": "question.schema.json#/properties/numericAnswer"
          },
          "caseNarrative": {
            "$ref": "question.schema.json#/properties/caseNarrative"
          },
          "caseData": {
            "$ref": "question.schema.json#/properties/caseData"
          },
          "subQuestions": {
            "$ref": "question.schema.json#/properties/subQuestions"
          },
          "explanation": {
            "$ref": "question.schema.json#/properties/explanation"
          },
          "modelAnswer": {
            "$ref": "question.schema.json#/properties/modelAnswer"
          },
          "rubric": {
            "$ref": "question.schema.json#/properties/rubric"
          },
          "acceptableAlternatives": {
            "$ref": "question.schema.json#/properties/acceptableAlternatives"
          },
          "references": {
            "$ref": "question.schema.json#/properties/references"
          }
        },
        "allOf": [
          {
            "$ref": "question.schema.json#/$defs/typeRules"
          }
        ]
      }
    }
  },
  "review-result.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "review-result.schema.json",
    "title": "Hasil review dari AI reviewer (SPEC 5.4, Prompt C)",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "reviewVersion",
      "batchId",
      "reviewerModel",
      "reviewedAt",
      "items",
      "batchNotes"
    ],
    "properties": {
      "reviewVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "batchId": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "reviewerModel": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "reviewedAt": {
        "$ref": "common.schema.json#/$defs/dateTime"
      },
      "items": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/reviewItem"
        }
      },
      "batchNotes": {
        "type": "string"
      }
    },
    "$defs": {
      "score1to5": {
        "type": "integer",
        "minimum": 1,
        "maximum": 5
      },
      "score1to5OrNull": {
        "type": [
          "integer",
          "null"
        ],
        "minimum": 1,
        "maximum": 5
      },
      "dimensionScores": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "keyCorrectness",
          "singleBestAnswer",
          "stemClarity",
          "distractorQuality",
          "rubricQuality",
          "dataConsistency",
          "alignment",
          "timeEstimate",
          "originality",
          "fairness"
        ],
        "properties": {
          "keyCorrectness": {
            "$ref": "#/$defs/score1to5"
          },
          "singleBestAnswer": {
            "$ref": "#/$defs/score1to5OrNull"
          },
          "stemClarity": {
            "$ref": "#/$defs/score1to5"
          },
          "distractorQuality": {
            "$ref": "#/$defs/score1to5OrNull"
          },
          "rubricQuality": {
            "$ref": "#/$defs/score1to5OrNull"
          },
          "dataConsistency": {
            "$ref": "#/$defs/score1to5OrNull"
          },
          "alignment": {
            "$ref": "#/$defs/score1to5"
          },
          "timeEstimate": {
            "$ref": "#/$defs/score1to5"
          },
          "originality": {
            "$ref": "#/$defs/score1to5"
          },
          "fairness": {
            "$ref": "#/$defs/score1to5"
          }
        }
      },
      "finding": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "severity",
          "dimension",
          "issue",
          "suggestedFix"
        ],
        "properties": {
          "severity": {
            "enum": [
              "kritis",
              "mayor",
              "minor"
            ]
          },
          "dimension": {
            "$ref": "common.schema.json#/$defs/dimensionName"
          },
          "issue": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "suggestedFix": {
            "type": "string"
          }
        }
      },
      "reviewItem": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "reviewKey",
          "contentHash",
          "independentAnswer",
          "keyAgreement",
          "dimensionScores",
          "findings",
          "suggestedDifficulty",
          "verdict",
          "confidence",
          "summary"
        ],
        "properties": {
          "reviewKey": {
            "type": "string",
            "pattern": "^R[0-9]{2,}$"
          },
          "contentHash": {
            "$ref": "common.schema.json#/$defs/sha256"
          },
          "independentAnswer": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          },
          "keyAgreement": {
            "enum": [
              "setuju",
              "tidak_setuju",
              "sebagian"
            ]
          },
          "dimensionScores": {
            "$ref": "#/$defs/dimensionScores"
          },
          "findings": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/finding"
            }
          },
          "suggestedDifficulty": {
            "$ref": "common.schema.json#/$defs/difficulty"
          },
          "verdict": {
            "$ref": "common.schema.json#/$defs/verdict"
          },
          "confidence": {
            "$ref": "common.schema.json#/$defs/confidence"
          },
          "summary": {
            "$ref": "common.schema.json#/$defs/nonEmptyString"
          }
        }
      }
    }
  },
  "session.schema.json": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "session.schema.json",
    "title": "Sesi ujian tersimpan dan cadangan sesi (SPEC 9 dan 10)",
    "$comment": "Struktur ini tidak dirinci di SPEC 5; dirancang pada fase A0 (lihat DECISIONS.md).",
    "type": "object",
    "additionalProperties": false,
    "required": [
      "schemaVersion",
      "sessionId",
      "appVersion",
      "subjectId",
      "packVersion",
      "packageId",
      "packageName",
      "mode",
      "config",
      "status",
      "startedAt",
      "deadline",
      "pauses",
      "totalPausedMs",
      "items",
      "answers",
      "events"
    ],
    "properties": {
      "schemaVersion": {
        "$ref": "common.schema.json#/$defs/schemaVersion"
      },
      "sessionId": {
        "$ref": "common.schema.json#/$defs/sessionId"
      },
      "appVersion": {
        "$ref": "common.schema.json#/$defs/semver"
      },
      "subjectId": {
        "$ref": "common.schema.json#/$defs/subjectId"
      },
      "packVersion": {
        "$ref": "common.schema.json#/$defs/semver"
      },
      "packageId": {
        "$ref": "common.schema.json#/$defs/packageId",
        "description": "ID paket dari pack (T1, T2, SIM) atau KUSTOM."
      },
      "packageName": {
        "$ref": "common.schema.json#/$defs/nonEmptyString"
      },
      "mode": {
        "enum": [
          "ketat",
          "latihan"
        ]
      },
      "config": {
        "$ref": "#/$defs/config"
      },
      "status": {
        "enum": [
          "ACTIVE",
          "PAUSED",
          "SUBMITTED"
        ]
      },
      "startedAt": {
        "$ref": "common.schema.json#/$defs/dateTime"
      },
      "deadline": {
        "$ref": "common.schema.json#/$defs/dateTime",
        "description": "Tenggat aktif. Mode latihan: diperbarui setiap lanjut dari jeda."
      },
      "remainingMsAtPause": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "integer",
            "minimum": 0
          }
        ]
      },
      "pauses": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/pause"
        }
      },
      "totalPausedMs": {
        "type": "integer",
        "minimum": 0
      },
      "items": {
        "type": "array",
        "minItems": 1,
        "items": {
          "$ref": "#/$defs/sessionItem"
        }
      },
      "answers": {
        "type": "object",
        "propertyNames": {
          "$ref": "common.schema.json#/$defs/questionId"
        },
        "additionalProperties": {
          "$ref": "#/$defs/answer"
        }
      },
      "events": {
        "type": "array",
        "items": {
          "$ref": "#/$defs/event"
        }
      },
      "submittedAt": {
        "$ref": "common.schema.json#/$defs/nullableDateTime"
      },
      "submittedReason": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "enum": [
              "MANUAL",
              "TIME_UP",
              "EXPIRED_ON_REOPEN"
            ]
          }
        ]
      },
      "grading": {
        "$ref": "#/$defs/grading"
      }
    },
    "allOf": [
      {
        "if": {
          "properties": {
            "status": {
              "const": "SUBMITTED"
            }
          },
          "required": [
            "status"
          ]
        },
        "then": {
          "required": [
            "submittedAt",
            "submittedReason",
            "grading"
          ],
          "properties": {
            "submittedAt": {
              "type": "string"
            },
            "submittedReason": {
              "type": "string"
            }
          }
        }
      },
      {
        "if": {
          "properties": {
            "status": {
              "const": "PAUSED"
            }
          },
          "required": [
            "status"
          ]
        },
        "then": {
          "required": [
            "remainingMsAtPause"
          ],
          "properties": {
            "remainingMsAtPause": {
              "type": "integer"
            }
          }
        }
      }
    ],
    "$defs": {
      "config": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "durationMinutes",
          "passingGrade",
          "shuffleQuestions",
          "shuffleOptions",
          "sectionWeights"
        ],
        "properties": {
          "durationMinutes": {
            "type": "integer",
            "minimum": 1,
            "maximum": 600
          },
          "passingGrade": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "shuffleQuestions": {
            "type": "boolean"
          },
          "shuffleOptions": {
            "type": "boolean"
          },
          "sectionWeights": {
            "type": "object",
            "propertyNames": {
              "$ref": "common.schema.json#/$defs/questionType"
            },
            "additionalProperties": {
              "type": "number",
              "minimum": 0,
              "maximum": 100
            }
          },
          "filters": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "difficulty": {
                "type": "array",
                "uniqueItems": true,
                "items": {
                  "$ref": "common.schema.json#/$defs/difficulty"
                }
              },
              "topicIds": {
                "type": "array",
                "uniqueItems": true,
                "items": {
                  "$ref": "common.schema.json#/$defs/topicId"
                }
              }
            }
          }
        }
      },
      "pause": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "pausedAt",
          "resumedAt",
          "remainingMs"
        ],
        "properties": {
          "pausedAt": {
            "$ref": "common.schema.json#/$defs/dateTime"
          },
          "resumedAt": {
            "$ref": "common.schema.json#/$defs/nullableDateTime"
          },
          "remainingMs": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "sessionItem": {
        "$comment": "Urutan elemen = urutan soal yang ditampilkan. question = salinan isi soal saat sesi dimulai (DECISIONS D-31).",
        "type": "object",
        "additionalProperties": false,
        "required": [
          "questionId",
          "type",
          "contentHash",
          "originalMaxScore",
          "points",
          "scaleFactor",
          "question"
        ],
        "properties": {
          "questionId": {
            "$ref": "common.schema.json#/$defs/questionId"
          },
          "question": {
            "$ref": "question.schema.json"
          },
          "type": {
            "$ref": "common.schema.json#/$defs/questionType"
          },
          "contentHash": {
            "$ref": "common.schema.json#/$defs/sha256"
          },
          "originalMaxScore": {
            "$ref": "common.schema.json#/$defs/positiveScore"
          },
          "points": {
            "type": "number",
            "minimum": 0,
            "multipleOf": 0.01,
            "description": "Skor maksimum soal di paket ini (skala 100)."
          },
          "scaleFactor": {
            "type": "number",
            "minimum": 0,
            "description": "points / originalMaxScore."
          },
          "optionOrder": {
            "type": "array",
            "minItems": 4,
            "maxItems": 4,
            "uniqueItems": true,
            "items": {
              "$ref": "common.schema.json#/$defs/optionKey"
            },
            "description": "Kunci asli menurut posisi tampil: optionOrder[0] tampil sebagai A."
          }
        },
        "if": {
          "properties": {
            "type": {
              "const": "mcq"
            }
          },
          "required": [
            "type"
          ]
        },
        "then": {
          "required": [
            "optionOrder"
          ]
        },
        "else": {
          "properties": {
            "optionOrder": false
          }
        }
      },
      "answer": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "value",
          "flagged",
          "updatedAt"
        ],
        "properties": {
          "value": {
            "type": [
              "null",
              "string",
              "number",
              "object"
            ],
            "propertyNames": {
              "$ref": "common.schema.json#/$defs/subQuestionId"
            },
            "additionalProperties": {
              "type": "string"
            },
            "description": "mcq: kunci ASLI (A-D); numeric: angka; essay: teks; case: objek {a: teks, b: teks}; null bila kosong."
          },
          "flagged": {
            "type": "boolean"
          },
          "updatedAt": {
            "$ref": "common.schema.json#/$defs/nullableDateTime"
          }
        }
      },
      "event": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "type",
          "at"
        ],
        "properties": {
          "type": {
            "enum": [
              "start",
              "answer_changed",
              "flag",
              "pause",
              "resume",
              "warning",
              "focus_lost",
              "clock_anomaly",
              "submit"
            ]
          },
          "at": {
            "$ref": "common.schema.json#/$defs/dateTime"
          },
          "questionId": {
            "$ref": "common.schema.json#/$defs/questionId"
          },
          "durationMs": {
            "type": "integer",
            "minimum": 0
          },
          "detail": {
            "type": "string"
          }
        }
      },
      "grading": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "status",
          "answersChecksum",
          "autoScores",
          "aiImports",
          "essayScores",
          "manualCorrections",
          "finalScore",
          "passed"
        ],
        "properties": {
          "status": {
            "enum": [
              "MENUNGGU_PENILAIAN_URAIAN",
              "PENILAIAN_SEBAGIAN",
              "FINAL"
            ]
          },
          "answersChecksum": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "$ref": "common.schema.json#/$defs/sha256"
              }
            ]
          },
          "autoScores": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "questionId",
                "rawScore",
                "scaledScore"
              ],
              "properties": {
                "questionId": {
                  "$ref": "common.schema.json#/$defs/questionId"
                },
                "rawScore": {
                  "type": "number",
                  "minimum": 0
                },
                "scaledScore": {
                  "type": "number",
                  "minimum": 0
                }
              }
            }
          },
          "aiImports": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "importedAt",
                "result"
              ],
              "properties": {
                "importedAt": {
                  "$ref": "common.schema.json#/$defs/dateTime"
                },
                "result": {
                  "$ref": "grading-result.schema.json"
                },
                "warnings": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "essayScores": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "questionId",
                "rawScore",
                "scaledScore",
                "sumMismatch",
                "manuallyCorrected"
              ],
              "properties": {
                "questionId": {
                  "$ref": "common.schema.json#/$defs/questionId"
                },
                "rawScore": {
                  "$ref": "common.schema.json#/$defs/score"
                },
                "scaledScore": {
                  "type": "number",
                  "minimum": 0
                },
                "sumMismatch": {
                  "type": "boolean"
                },
                "manuallyCorrected": {
                  "type": "boolean"
                }
              }
            }
          },
          "manualCorrections": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "questionId",
                "subId",
                "criterionId",
                "before",
                "after",
                "reason",
                "at"
              ],
              "properties": {
                "questionId": {
                  "$ref": "common.schema.json#/$defs/questionId"
                },
                "subId": {
                  "anyOf": [
                    {
                      "type": "null"
                    },
                    {
                      "$ref": "common.schema.json#/$defs/subQuestionId"
                    }
                  ]
                },
                "criterionId": {
                  "$ref": "common.schema.json#/$defs/criterionId"
                },
                "before": {
                  "$ref": "common.schema.json#/$defs/score"
                },
                "after": {
                  "$ref": "common.schema.json#/$defs/score"
                },
                "reason": {
                  "$ref": "common.schema.json#/$defs/nonEmptyString"
                },
                "at": {
                  "$ref": "common.schema.json#/$defs/dateTime"
                }
              }
            }
          },
          "finalScore": {
            "type": [
              "number",
              "null"
            ],
            "minimum": 0,
            "maximum": 100
          },
          "passed": {
            "type": [
              "boolean",
              "null"
            ]
          }
        }
      }
    }
  }
};
