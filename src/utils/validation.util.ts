import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidUnknownValues: true,
  exceptionFactory(errors): unknown {
    return new BadRequestException(
      errors.map((error) => ({
        name: error.property,
        errors: Object.entries(error.constraints).map(([_, v]) => v),
      })),
    );
  },
};

// ({
//   whitelist: true,
//   transform: true,
//   forbidUnknownValues: true,
//   exceptionFactory(errors): unknown {
//     return new BadRequestException(
//       errors.map((error) => ({
//         name: error.property,
//         errors: Object.entries(error.constraints).map(([_, v]) => v),
//       })),
//     );
//   },
// })
