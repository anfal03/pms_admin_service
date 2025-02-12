import { Injectable, ArgumentMetadata, BadRequestException,ArgumentsHost, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response, NextFunction  } from 'express';


@Injectable()
export class ValidateInputPipe extends ValidationPipe {

  constructor(){ 

    super({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(validationErrors);
      }
    }) 

  }


   public async transform(value, metadata: ArgumentMetadata) {

      try {

        return await super.transform(value, metadata);

      } catch (e) {

        const error = e
         if (e instanceof UnprocessableEntityException) {

            throw new UnprocessableEntityException(this.handleError(error.response.message));
         }
      }
   }

   /*
   {
    "issuccess": false,
    "statusCode": 422,
    "errors": {
        "point_expiry_interval_days": [
            "point_expiry_interval_days must not be less than 1",
            "point_expiry_interval_days must be a number conforming to the specified constraints",
            "point_expiry_interval_days should not be empty"
        ],
        "items": [
            {},
            {
                "start_range": [
                    "start_range should not be empty"
                ],
                "point_receiver_type": [
                    "point_receiver_type must be one of the following values: sender, receiver, both",
                    "point_receiver_type must be a string"
                ]`
            }
        ]
    },
    "message": "The server cannot process the input due to validation error"
 }
*/
   private handleError(errors) {

        const errorsArray = {}
        errors.forEach((error, index) => {

          if (!error.children.length) {

            errorsArray[error.property] = Object.values(error.constraints) 
          }

          else {
  
            let errorsNestedArray = error.value.map(() => { return {} })

            error.children.forEach((nestederror,nestedindex) => {

              if (!nestederror.children.length) {

               // errorsArray[nestederror.property] = Object.values(nestederror.constraints)
               errorsNestedArray[nestederror.property] = Object.values(nestederror.constraints)
              }
              else {

                let n1error = {}
                nestederror.children.forEach((nestederror2,nestedindex2) => {

                  if (!nestederror2.children.length) {

                    n1error[nestederror2.property] = Object.values(nestederror2.constraints)
                   // errorsArray[nestederror2.property] = Object.values(nestederror2.constraints)
                  }

                })

                errorsNestedArray[nestederror.property] = n1error
              }
              
            }) 

            errorsArray[error.property] = errorsNestedArray

          }

        })
        return errorsArray;

   }
}




