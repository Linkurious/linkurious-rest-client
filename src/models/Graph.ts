/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-20.
 */

// type SchemaCompliantValue =
//   | string
//   | number
//   | boolean
//   | LkDate
//   | LkDatetime
//   | MissingValue
//   | InvalidValue
//   | ConflictValue;
//
// type LkPropertyValue = string | number | boolean | string[] | null;

// interface LkDate {
//   type: LkPropertyType.DATE;
//   value: number;
// }
//
// interface LkDatetime {
//   type: LkPropertyType.DATETIME;
//   value: number;
// }
//
// interface MissingValue {
//   type: LkPropertyType;
//   status: 'missing';
// }
//
// interface InvalidValue {
//   type: LkPropertyType;
//   status: 'invalid';
//   original: string; // when not of the good type we return a string representation (string[] feel in this category)
// }
//
// interface ConflictValue {
//   type: 'auto';
//   status: 'conflict';
//   original: string; // when schema is in conflict we return a string representation
// }
