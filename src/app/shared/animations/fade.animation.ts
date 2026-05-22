import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

export const fadeAnimation = trigger(

  'fadeAnimation',

  [

    transition(':enter', [

      style({
        opacity: 0,
        transform: 'translateY(-5px)'
      }),

      animate(
        '200ms ease-in-out',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      )

    ]),

    transition(':leave', [

      animate(
        '200ms ease-in-out',
        style({
          opacity: 0,
          transform: 'translateY(-5px)'
        })
      )

    ])

  ]

);
