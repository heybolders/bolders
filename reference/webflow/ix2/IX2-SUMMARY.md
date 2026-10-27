# IX2 – rezumat interacțiuni Webflow (generat din ix2-site.json)

Format: eveniment → element declanșator → listă de acțiuni (grupuri secvențiale; în grup = paralel).

## e-37 · NAVBAR_OPEN · ?
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Navbar menu [Open]**
- g0: MOVE[CHILDREN .menu-icon_line-top] y=8px 400ms inOutQuint ; MOVE[CHILDREN .menu-icon_line-bottom] y=-8px 400ms inOutQuint ; ROTATE[CHILDREN .menu-icon_line-bottom] z=-45 400ms inOutQuint ; ROTATE[CHILDREN .menu-icon_line-top] z=45 400ms inOutQuint ; STYLE_OPACITY[CHILDREN .menu-icon_line-middle] v=0 400ms inOutQuint

## e-38 · NAVBAR_CLOSE · ?
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Navbar menu [Close]**
- g0: MOVE[CHILDREN .menu-icon_line-top] y=0px 400ms inOutQuint ; MOVE[CHILDREN .menu-icon_line-bottom] y=0px 400ms inOutQuint ; ROTATE[CHILDREN .menu-icon_line-bottom] z=0 400ms inOutQuint ; ROTATE[CHILDREN .menu-icon_line-top] z=0 400ms inOutQuint ; STYLE_OPACITY[CHILDREN .menu-icon_line-middle] v=1 400ms inOutQuint

## e-72 · MOUSE_OVER · class .portfolio_item
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Portfolio Item [Hover In]**
- g0: MOVE[self] y=0rem 500ms ; MOVE[CHILDREN .portfolio_image] y=0% 500ms ; STYLE_BACKGROUND_COLOR[CHILDREN .portfolio_image-overlay-layer] r=0,g=0,b=0,a=0 500ms ; STYLE_OPACITY[CHILDREN .button.is-portfolio] v=1 500ms
- g1: MOVE[self] y=-1rem 200ms ease ; STYLE_OPACITY[CHILDREN .button.is-portfolio] v=1 200ms ease ; STYLE_BACKGROUND_COLOR[CHILDREN .portfolio_image-overlay-layer] r=255,g=255,b=255,a=0.2 200ms ease
- g2: MOVE[CHILDREN .portfolio_image] y=-77% 50000ms ease

## e-73 · MOUSE_OUT · class .portfolio_item
config: loop=true playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Portfolio Item [Hover In]**
- g0: MOVE[self] y=0rem 500ms ; MOVE[CHILDREN .portfolio_image] y=0% 500ms ; STYLE_BACKGROUND_COLOR[CHILDREN .portfolio_image-overlay-layer] r=0,g=0,b=0,a=0 500ms ; STYLE_OPACITY[CHILDREN .button.is-portfolio] v=1 500ms
- g1: MOVE[self] y=-1rem 200ms ease ; STYLE_OPACITY[CHILDREN .button.is-portfolio] v=1 200ms ease ; STYLE_BACKGROUND_COLOR[CHILDREN .portfolio_image-overlay-layer] r=255,g=255,b=255,a=0.2 200ms ease
- g2: MOVE[CHILDREN .portfolio_image] y=-77% 50000ms ease

## e-75 · SCROLL_INTO_VIEW · ?
config: loop=true playInReverse=false scrollOffsetValue=0 scrollOffsetUnit=% delay=null direction=null
actionList: **Partner [Loop]**
- g0: MOVE[CHILDREN .partner_list] x=0% 0ms
- g1: MOVE[CHILDREN .partner_list] x=-100% 50000ms

## e-77 · MOUSE_OVER · class undefined
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Instagram / Component Overlay**
- g0: STYLE_OPACITY[{}] v=0 500ms
- g1: STYLE_OPACITY[{}] v=1 300ms ease ; SCALE[{}] x=1.1,y=1.1 300ms ease

## e-78 · MOUSE_OUT · class undefined
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Instagram / Component Overlay Out**
- g0: STYLE_OPACITY[{}] v=0 300ms ease ; SCALE[{}] x=1,y=1 300ms ease

## e-79 · MOUSE_OVER · class .intagram-card-a
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Instagram / Component Overlay**
- g0: STYLE_OPACITY[{}] v=0 500ms
- g1: STYLE_OPACITY[{}] v=1 300ms ease ; SCALE[{}] x=1.1,y=1.1 300ms ease

## e-80 · MOUSE_OUT · class .intagram-card-a
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Instagram / Component Overlay Out**
- g0: STYLE_OPACITY[{}] v=0 300ms ease ; SCALE[{}] x=1,y=1 300ms ease

## e-81 · MOUSE_OVER · ?
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Logo [Hover In]**
- g0: MOVE[CHILDREN .navbar_logo.is-icon] y=-110% 500ms
- g1: MOVE[CHILDREN .navbar_logo.is-icon] y=0% 300ms ease

## e-82 · MOUSE_OUT · ?
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Logo [Hover Out]**
- g0: MOVE[CHILDREN .navbar_logo.is-icon] y=-110% 300ms ease

## e-84 · MOUSE_MOVE · PAGE
config: continuousParameterGroupId=a-44-p smoothing=85 restingState=50 | continuousParameterGroupId=a-44-p-2 smoothing=85 restingState=50
actionList: **Cursor**
- continuous MOUSE_X:
  - @0%: MOVE[.cursor-element] x=-50vw 500ms
  - @100%: MOVE[.cursor-element] x=50vw 500ms
- continuous MOUSE_Y:
  - @0%: MOVE[.cursor-element] y=-50vh 500ms
  - @100%: MOVE[.cursor-element] y=50vh 500ms

## e-85 · MOUSE_OVER · class .button
config: loop=true playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Button Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_TEXT_COLOR[self] r=255,g=255,b=255,a=1 500ms ; STYLE_SIZE[CHILDREN .button-inner-shadow] 500ms ; STYLE_OPACITY[CHILDREN .button-inner-shadow] v=0 500ms ; STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_BACKGROUND_COLOR[self] r=29,g=29,b=29,a=1 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_TEXT_COLOR[self] r=255,g=255,b=255,a=1 200ms ease ; STYLE_BACKGROUND_COLOR[self] r=29,g=29,b=29,a=1 100ms ease ; STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_OPACITY[CHILDREN .button-inner-shadow] v=1 200ms ease ; STYLE_SIZE[CHILDREN .button-inner-shadow] 200ms ease

## e-86 · MOUSE_OUT · class .button
config: loop=true playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Button Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_TEXT_COLOR[self] r=255,g=255,b=255,a=1 200ms ease ; STYLE_SIZE[CHILDREN .button-inner-shadow] 200ms ease ; STYLE_OPACITY[CHILDREN .button-inner-shadow] v=0 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_BACKGROUND_COLOR[self] r=29,g=29,b=29,a=1 100ms ease

## e-87 · MOUSE_MOVE · class .button
config: continuousParameterGroupId=a-48-p smoothing=80 restingState=50 | continuousParameterGroupId=a-48-p-2 smoothing=80 restingState=50
actionList: **Button**
- continuous MOUSE_X:
  - @0%: MOVE[self] x=-20px 500ms
  - @100%: MOVE[self] x=20px 500ms
- continuous MOUSE_Y:
  - @0%: MOVE[self] y=-20px 500ms
  - @100%: MOVE[self] y=20px 500ms

## e-92 · MOUSE_MOVE · class .footer_social-link
config: continuousParameterGroupId=a-48-p smoothing=80 restingState=50 | continuousParameterGroupId=a-48-p-2 smoothing=50 restingState=50
actionList: **Button**
- continuous MOUSE_X:
  - @0%: MOVE[self] x=-20px 500ms
  - @100%: MOVE[self] x=20px 500ms
- continuous MOUSE_Y:
  - @0%: MOVE[self] y=-20px 500ms
  - @100%: MOVE[self] y=20px 500ms

## e-93 · MOUSE_OVER · class .footer_social-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Button Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_TEXT_COLOR[self] r=255,g=255,b=255,a=1 500ms ; STYLE_SIZE[CHILDREN .button-inner-shadow] 500ms ; STYLE_OPACITY[CHILDREN .button-inner-shadow] v=0 500ms ; STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_BACKGROUND_COLOR[self] r=29,g=29,b=29,a=1 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_TEXT_COLOR[self] r=255,g=255,b=255,a=1 200ms ease ; STYLE_BACKGROUND_COLOR[self] r=29,g=29,b=29,a=1 100ms ease ; STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_OPACITY[CHILDREN .button-inner-shadow] v=1 200ms ease ; STYLE_SIZE[CHILDREN .button-inner-shadow] 200ms ease

## e-94 · MOUSE_OUT · class .footer_social-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Button Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_TEXT_COLOR[self] r=255,g=255,b=255,a=1 200ms ease ; STYLE_SIZE[CHILDREN .button-inner-shadow] 200ms ease ; STYLE_OPACITY[CHILDREN .button-inner-shadow] v=0 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_BACKGROUND_COLOR[self] r=29,g=29,b=29,a=1 100ms ease

## e-95 · MOUSE_OVER · ?
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-96 · MOUSE_OUT · ?
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-97 · MOUSE_OVER · class .footer_link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-98 · MOUSE_OUT · class .footer_link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-99 · MOUSE_OVER · class .footer_certificate-wrapper
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-100 · MOUSE_OUT · class .footer_certificate-wrapper
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-103 · MOUSE_OVER · class .navbar_link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-104 · MOUSE_OUT · class .navbar_link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-107 · MOUSE_OVER · class .external-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-108 · MOUSE_OUT · class .external-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-109 · MOUSE_OVER · class .testimonial_client-logo-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-110 · MOUSE_OUT · class .testimonial_client-logo-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-111 · MOUSE_OVER · class .header_testimonail-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-112 · MOUSE_OUT · class .header_testimonail-link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-170 · SCROLL_INTO_VIEW · ?
config: loop=false playInReverse=false scrollOffsetValue=0 scrollOffsetUnit=% delay=null direction=null
actionList: **fade in [ 0.4 ]**
- g0: STYLE_OPACITY[self] v=0 500ms ; STYLE_OPACITY[{}] v=0 500ms
- g1: STYLE_OPACITY[self] v=1 600ms outCubic ; STYLE_OPACITY[{}] v=1 600ms outCubic

## e-172 · SCROLL_INTO_VIEW · home: .heading_interaction-wrap
config: loop=true playInReverse=false scrollOffsetValue=0 scrollOffsetUnit=% delay=null direction=null
actionList: **heading [ scroll in - change txt ]**
- g0: MOVE[CHILDREN .heading-move._1] y=-100% 500ms ; STYLE_OPACITY[CHILDREN .heading-move._1] v=0 500ms ; STYLE_FILTER[CHILDREN .heading-move._1] 500ms ; MOVE[CHILDREN .heading-move._2] y=-100% 500ms ; STYLE_FILTER[CHILDREN .heading-move._2] 500ms ; STYLE_OPACITY[CHILDREN .heading-move._2] v=0 500ms ; MOVE[CHILDREN .heading-move._3] y=-100% 500ms ; STYLE_OPACITY[CHILDREN .heading-move._3] v=0 500ms ; STYLE_FILTER[CHILDREN .heading-move._3] 500ms ; MOVE[CHILDREN .heading-move._4] y=-100% 500ms ; STYLE_FILTER[CHILDREN .heading-move._4] 500ms ; STYLE_OPACITY[CHILDREN .heading-move._4] v=0 500ms ; MOVE[CHILDREN .heading-move._5] y=-100% 500ms ; STYLE_OPACITY[CHILDREN .heading-move._5] v=0 500ms ; STYLE_FILTER[CHILDREN .heading-move._5] 500ms ; MOVE[CHILDREN .heading-move._6] y=-100% 500ms ; STYLE_FILTER[CHILDREN .heading-move._6] 500ms ; STYLE_OPACITY[CHILDREN .heading-move._6] v=0 500ms ; MOVE[CHILDREN .heading-move._7] y=-100% 500ms ; STYLE_OPACITY[CHILDREN .heading-move._7] v=0 500ms ; STYLE_FILTER[CHILDREN .heading-move._7] 500ms
- g1: MOVE[CHILDREN .heading-move._1] y=0% 400ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._1] 400ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._1] v=1 400ms outCirc ; MOVE[CHILDREN .heading-move._2] y=0% 400ms +100ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._2] v=1 400ms +100ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._2] 400ms +100ms outCirc ; MOVE[CHILDREN .heading-move._3] y=0% 400ms +200ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._3] 400ms +200ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._3] v=1 400ms +200ms outCirc ; MOVE[CHILDREN .heading-move._4] y=0% 400ms +300ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._4] v=1 400ms +300ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._4] 400ms +300ms outCirc ; MOVE[CHILDREN .heading-move._5] y=0% 400ms +400ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._5] 400ms +400ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._5] v=1 400ms +400ms outCirc ; MOVE[CHILDREN .heading-move._6] y=0% 400ms +500ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._6] v=1 400ms +500ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._6] 400ms +500ms outCirc ; MOVE[CHILDREN .heading-move._7] y=0% 400ms +600ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._7] 400ms +600ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._7] v=1 400ms +600ms outCirc
- g2: STYLE_FILTER[CHILDREN .heading-move._1] 500ms +3000ms outCirc ; MOVE[CHILDREN .heading-move._1] x=160%,y=0% 500ms +3000ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._1] v=0 500ms +3000ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._2] v=0 500ms +3100ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._2] 500ms +3100ms outCirc ; MOVE[CHILDREN .heading-move._2] x=160%,y=0% 500ms +3100ms outCirc ; MOVE[CHILDREN .heading-move._3] x=160%,y=0% 500ms +3200ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._3] v=0 500ms +3200ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._3] 500ms +3200ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._4] 500ms +3300ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._4] v=0 500ms +3300ms outCirc ; MOVE[CHILDREN .heading-move._4] x=160%,y=0% 500ms +3300ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._5] v=0 500ms +3400ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._5] 500ms +3400ms outCirc ; MOVE[CHILDREN .heading-move._5] x=160%,y=0% 500ms +3400ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._6] 500ms +3500ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._6] v=0 500ms +3500ms outCirc ; MOVE[CHILDREN .heading-move._6] x=160%,y=0% 500ms +3500ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._7] 500ms +3600ms outCirc ; MOVE[CHILDREN .heading-move._7] x=160%,y=0% 500ms +3600ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._7] v=0 500ms +3600ms outCirc
- g3: STYLE_FILTER[CHILDREN .heading-move._7] 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._7] v=0 0ms outCirc ; MOVE[CHILDREN .heading-move._7] x=0%,y=-100% 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._6] v=0 0ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._6] 0ms outCirc ; MOVE[CHILDREN .heading-move._6] x=0%,y=-100% 0ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._5] 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._5] v=0 0ms outCirc ; MOVE[CHILDREN .heading-move._5] x=0%,y=-100% 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._4] v=0 0ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._4] 0ms outCirc ; MOVE[CHILDREN .heading-move._4] x=0%,y=-100% 0ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._3] 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._3] v=0 0ms outCirc ; MOVE[CHILDREN .heading-move._3] x=0%,y=-100% 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._2] v=0 0ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._2] 0ms outCirc ; MOVE[CHILDREN .heading-move._2] x=0%,y=-100% 0ms outCirc ; STYLE_FILTER[CHILDREN .heading-move._1] 0ms outCirc ; STYLE_OPACITY[CHILDREN .heading-move._1] v=0 0ms outCirc ; MOVE[CHILDREN .heading-move._1] x=0%,y=-100% 0ms outCirc

## e-174 · SCROLL_INTO_VIEW · home: .section_portfolio
config: loop=false playInReverse=false scrollOffsetValue=75 scrollOffsetUnit=% delay=null direction=null
actionList: **Portfolio Background**
- g0: STYLE_SIZE[CHILDREN .padding-global-portfolio] 500ms
- g1: STYLE_SIZE[CHILDREN .padding-global-portfolio] 500ms ease

## e-175 · SCROLL_OUT_OF_VIEW · home: .section_portfolio
config: loop=false playInReverse=false scrollOffsetValue=50 scrollOffsetUnit=% delay=null direction=null
actionList: **Portfolio Background close**
- g0: STYLE_SIZE[CHILDREN .padding-global-portfolio] 500ms ease

## e-176 · MOUSE_MOVE · home: .portfolio_component
config: continuousParameterGroupId=a-29-p smoothing=95 restingState=50 | continuousParameterGroupId=a-29-p-2 smoothing=95 restingState=50
actionList: **Portfolio**
- continuous MOUSE_X:
  - @0%: MOVE[.portfolio_list-wrapper] x=15vw 500ms easeOut
  - @100%: MOVE[.portfolio_list-wrapper] x=-15vw 500ms easeOut
- continuous MOUSE_Y:

## e-177 · SCROLLING_IN_VIEW · home: .portfolio_component
config: continuousParameterGroupId=a-38-p smoothing=50
actionList: **Portfolio - Mobile**
- continuous SCROLL_PROGRESS:
  - @0%: MOVE[self] x=2rem 500ms
  - @100%: MOVE[self] x=-2rem 500ms

## e-178 · SCROLLING_IN_VIEW · class .section
config: continuousParameterGroupId=a-68-p smoothing=86
actionList: **Scrolling through panels**
- continuous SCROLL_PROGRESS:
  - @0%: ROTATE[{}] x=-40deg,y=-40deg 500ms ; STYLE_OPACITY[{}] v=0 500ms ; SCALE[{}] x=0.8,y=0.8 500ms ; MOVE[{}] y=-10vw,z=60 500ms
  - @10%: STYLE_OPACITY[{}] v=1 500ms
  - @50%: ROTATE[{}] x=0deg,y=0deg 500ms ; STYLE_OPACITY[{}] v=1 500ms ; SCALE[{}] x=1,y=1 500ms ; MOVE[{}] y=0vw,z=0 500ms
  - @90%: STYLE_OPACITY[{}] v=0 500ms
  - @100%: ROTATE[{}] x=40deg,y=40deg 500ms ; STYLE_OPACITY[{}] v=0 500ms ; SCALE[{}] x=0.8,y=0.8 500ms ; MOVE[{}] y=10vw,z=60 500ms

## e-179 · MOUSE_MOVE · home: .botton-wrapper.glowing-wrapper-active
config: continuousParameterGroupId=a-48-p smoothing=50 restingState=50 | continuousParameterGroupId=a-48-p-2 smoothing=50 restingState=50
actionList: **Button**
- continuous MOUSE_X:
  - @0%: MOVE[self] x=-20px 500ms
  - @100%: MOVE[self] x=20px 500ms
- continuous MOUSE_Y:
  - @0%: MOVE[self] y=-20px 500ms
  - @100%: MOVE[self] y=20px 500ms

## e-186 · MOUSE_OVER · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Fan Cards Wide**
- g0: ROTATE[CHILDREN ] z=16 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX 500ms ; MOVE[CHILDREN ] x=-10PX 500ms
- g1: MOVE[CHILDREN ] x=-350px,y=111px,z=0 300ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] y=0deg,z=4 300ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=350px,y=111px 300ms outSine ; ROTATE[CHILDREN ] x=0deg,y=0deg,z=-26 300ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] y=0deg,z=35 300ms outSine

## e-187 · MOUSE_OUT · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Close Fan**
- g0: ROTATE[CHILDREN ] z=-4 500ms ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=0,g=0,b=0,a=0 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX,y=0PX 500ms ; MOVE[CHILDREN ] x=-10PX,y=0PX 500ms

## e-190 · MOUSE_CLICK · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Fan Cards narow**
- g0: ROTATE[CHILDREN ] z=-4 500ms ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=0,g=0,b=0,a=0 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX 500ms ; MOVE[CHILDREN ] x=-10PX 500ms
- g1: MOVE[CHILDREN ] x=-180PX,y=40PX 400ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=4 300ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=275px,y=150px 400ms outSine ; ROTATE[CHILDREN ] z=-20 400ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=30 400ms outSine ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=255,g=197,b=3,a=1 300ms

## e-191 · MOUSE_SECOND_CLICK · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Close Fan**
- g0: ROTATE[CHILDREN ] z=-4 500ms ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=0,g=0,b=0,a=0 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX,y=0PX 500ms ; MOVE[CHILDREN ] x=-10PX,y=0PX 500ms

## e-194 · SCROLL_INTO_VIEW · home: .about-content.smaller
config: loop=false playInReverse=false scrollOffsetValue=20 scrollOffsetUnit=% delay=null direction=null
actionList: **About Us text**
- g0: STYLE_TEXT_COLOR[{}] r=255,g=255,b=255,a=0.2 500ms
- g1: STYLE_TEXT_COLOR[CHILDREN ] r=255,g=255,b=255,a=1 800ms easeIn ; STYLE_TEXT_COLOR[CHILDREN ] r=255,g=255,b=255,a=1 800ms +200ms easeIn ; STYLE_TEXT_COLOR[CHILDREN ] r=255,g=255,b=255,a=1 800ms +400ms easeIn ; STYLE_TEXT_COLOR[CHILDREN ] r=255,g=255,b=255,a=1 800ms +600ms easeIn ; STYLE_TEXT_COLOR[CHILDREN ] r=255,g=255,b=255,a=1 800ms +800ms easeIn ; STYLE_TEXT_COLOR[CHILDREN ] r=255,g=255,b=255,a=1 800ms +1000ms easeIn

## e-195 · SCROLL_OUT_OF_VIEW · home: .about-content.smaller
config: loop=false playInReverse=false scrollOffsetValue=0 scrollOffsetUnit=% delay=null direction=null
actionList: **About Text Scroll out**
- g0: STYLE_TEXT_COLOR[{}] r=255,g=255,b=255,a=0.2 100ms

## e-197 · SCROLL_INTO_VIEW · class .flex-vertical-left
config: loop=false playInReverse=false scrollOffsetValue=15 scrollOffsetUnit=% delay=100 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-199 · MOUSE_SECOND_CLICK · home: .accordion-tab-button
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Accordion Click Close**
- g0: STYLE_SIZE[SIBLINGS .accordion-pane] 900ms inOutQuart ; ROTATE[CHILDREN .arrow-div.invert] z=-90 700ms inOutQuart

## e-200 · MOUSE_CLICK · home: .accordion-tab-button
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Accordion Click Open**
- g0: STYLE_SIZE[SIBLINGS .accordion-pane] 500ms easeInOut ; ROTATE[CHILDREN .arrow-div.invert] z=-90 700ms inOutQuart
- g1: STYLE_SIZE[SIBLINGS .accordion-pane] 900ms inOutQuart ; ROTATE[CHILDREN .arrow-div.invert] z=0 700ms inOutQuart

## e-212 · SCROLLING_IN_VIEW · class .sticky-wrap-2
config: continuousParameterGroupId=a-84-p smoothing=50
actionList: **Scroll Progress**
- continuous SCROLL_PROGRESS:
  - @0%: STYLE_SIZE[{}] 500ms
  - @100%: STYLE_SIZE[{}] 500ms

## e-214 · MOUSE_MOVE · ?
config: continuousParameterGroupId=a-85-p smoothing=60 restingState=20 | continuousParameterGroupId=a-85-p-2 smoothing=60 restingState=20
actionList: **Footer Gradient Animation**
- continuous MOUSE_X:
  - @1%: MOVE[CHILDREN .footer_logo-overlay-gradient] x=-80%,y=-20% 500ms
  - @5%: ROTATE[CHILDREN .footer_logo-overlay-gradient] z=-55 500ms
  - @20%: MOVE[CHILDREN .footer_logo-overlay-gradient] x=0%,y=0% 500ms ; ROTATE[CHILDREN .footer_logo-overlay-gradient] z=0 500ms
  - @59%: ROTATE[CHILDREN .footer_logo-overlay-gradient] z=55 500ms
  - @80%: MOVE[CHILDREN .footer_logo-overlay-gradient] x=80%,y=-10% 500ms
- continuous MOUSE_Y:

## e-215 · MOUSE_MOVE · ?
config: continuousParameterGroupId=a-48-p smoothing=50 restingState=50 | continuousParameterGroupId=a-48-p-2 smoothing=50 restingState=50
actionList: **Button**
- continuous MOUSE_X:
  - @0%: MOVE[self] x=-20px 500ms
  - @100%: MOVE[self] x=20px 500ms
- continuous MOUSE_Y:
  - @0%: MOVE[self] y=-20px 500ms
  - @100%: MOVE[self] y=20px 500ms

## e-216 · SCROLL_INTO_VIEW · home: .section_resources.z-index-1
config: loop=false playInReverse=false scrollOffsetValue=50 scrollOffsetUnit=% delay=null direction=null
actionList: **Resource Menu Transition**
- g0: MOVE[{}] x=-10% 100ms easeInOut ; MOVE[{}] x=100% 500ms easeInOut ; MOVE[{}] x=0% 500ms +100ms easeInOut

## e-217 · SCROLL_OUT_OF_VIEW · home: .section_resources.z-index-1
config: loop=false playInReverse=false scrollOffsetValue=0 scrollOffsetUnit=% delay=null direction=null
actionList: **Resource Menu Reset**
- g0: MOVE[{}] x=0% 500ms easeInOut

## e-218 · MOUSE_OVER · class .resources_link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Shiny Gradient Hover**
- g0: MOVE[CHILDREN .resources_gradient-hover] x=100% 500ms
- g1: MOVE[CHILDREN .resources_gradient-hover] x=-100% 500ms easeInOut

## e-219 · MOUSE_OUT · class .resources_link
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Shiny Gradient Hover - Out**
- g0: MOVE[CHILDREN .resources_gradient-hover] x=100% 0ms

## e-220 · SCROLLING_IN_VIEW · home: .resources_space-image
config: continuousParameterGroupId=a-90-p smoothing=50
actionList: **Space Image Parallax**
- continuous SCROLL_PROGRESS:
  - @0%: MOVE[self] y=0% 500ms
  - @100%: MOVE[self] y=40% 500ms

## e-231 · MOUSE_OUT · class .hp-inner
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **[Home] Portfolio Hover Out**
- g0: STYLE_SIZE[CHILDREN .hp-hover] 1000ms outQuart

## e-244 · MOUSE_OUT · class .button-2
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Button Hover Out 2**
- g0: MOVE[{}] y=101% 1000ms outQuart

## e-245 · MOUSE_OVER · class .hp-inner
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **[Home] Portfolio Hover**
- g0: STYLE_SIZE[CHILDREN .hp-hover] 500ms
- g1: STYLE_SIZE[CHILDREN .hp-hover] 1000ms outQuart

## e-246 · MOUSE_OVER · class .button-2
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Button Hover**
- g0: MOVE[{}] y=101% 500ms
- g1: MOVE[{}] y=0% 1000ms outQuart

## e-295 · MOUSE_OVER · home: .text-style-link.w-inline-block
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover In**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease
- g1: STYLE_FILTER[.cursor-element] 200ms ease ; STYLE_SIZE[.cursor-element] 200ms ease

## e-296 · MOUSE_OUT · home: .text-style-link.w-inline-block
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Link Hover Out**
- g0: STYLE_SIZE[.cursor-element] 200ms ease ; STYLE_FILTER[.cursor-element] 200ms ease

## e-308 · MOUSE_OVER · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Fan Cards Wide 2**
- g0: ROTATE[CHILDREN ] z=16 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX 500ms ; MOVE[CHILDREN ] x=-10PX 500ms
- g1: MOVE[CHILDREN ] x=-350px,y=111px,z=0 300ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] y=0deg,z=4 300ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=350px,y=111px 300ms outSine ; ROTATE[CHILDREN ] x=0deg,y=0deg,z=-26 300ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] y=0deg,z=35 300ms outSine

## e-309 · MOUSE_OUT · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Close Fan 2**
- g0: ROTATE[CHILDREN ] z=-4 500ms ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=0,g=0,b=0,a=0 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX,y=0PX 500ms ; MOVE[CHILDREN ] x=-10PX,y=0PX 500ms

## e-312 · MOUSE_CLICK · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Fan Cards narow 2**
- g0: ROTATE[CHILDREN ] z=-4 500ms ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=0,g=0,b=0,a=0 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX 500ms ; MOVE[CHILDREN ] x=-10PX 500ms
- g1: MOVE[CHILDREN ] x=-180PX,y=40PX 400ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=4 300ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=275px,y=150px 400ms outSine ; ROTATE[CHILDREN ] z=-20 400ms outSine ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=30 400ms outSine ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=255,g=197,b=3,a=1 300ms

## e-313 · MOUSE_SECOND_CLICK · home: .card_wrapper.hide-tablet
config: loop=false playInReverse=false scrollOffsetValue=null scrollOffsetUnit=null delay=null direction=null
actionList: **Close Fan 2**
- g0: ROTATE[CHILDREN ] z=-4 500ms ; STYLE_BACKGROUND_COLOR[id:5d5c462f6b9318c71bed42e5] r=0,g=0,b=0,a=0 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913e] z=-2 500ms ; ROTATE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] z=6 500ms ; MOVE[id:3abf00e7-7998-e193-2bc7-c21b5716913f] x=0PX,y=0PX 500ms ; MOVE[CHILDREN ] x=-10PX,y=0PX 500ms

## e-334 · SCROLL_INTO_VIEW · departamente: .text-weight-xbold
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=LEFT
actionList: **slideInLeft**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=-100PX,y=0PX 0ms
- g2: STYLE_OPACITY[self] v=1 1000ms outQuart ; MOVE[self] x=0PX,y=0PX 1000ms outQuart

## e-336 · SCROLL_INTO_VIEW · departamente: .branding_image._1
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=400 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-338 · SCROLL_INTO_VIEW · departamente: .text-size-xxl
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-340 · SCROLL_INTO_VIEW · departamente: .text-size-medium
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=RIGHT
actionList: **slideInRight**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=100PX,y=0PX 0ms
- g2: STYLE_OPACITY[self] v=1 1000ms outQuart ; MOVE[self] x=0PX,y=0PX 1000ms outQuart

## e-342 · SCROLL_INTO_VIEW · departamente: .hp-image._2
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=200 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-344 · SCROLL_INTO_VIEW · departamente: .hp-image._1
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-352 · SCROLL_INTO_VIEW · departamente: .text-size-large
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=RIGHT
actionList: **slideInRight**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=100PX,y=0PX 0ms
- g2: STYLE_OPACITY[self] v=1 1000ms outQuart ; MOVE[self] x=0PX,y=0PX 1000ms outQuart

## e-354 · SCROLLING_IN_VIEW · departamente: .wrapper_services
config: continuousParameterGroupId=a-93-p smoothing=50
actionList: **[Home] Lottie Circle**
- continuous SCROLL_PROGRESS:
  - @0%: PLUGIN_LOTTIE[CHILDREN .lottie-circle] v=0 500ms
  - @65%: PLUGIN_LOTTIE[CHILDREN .lottie-circle] v=99 500ms

## e-355 · SCROLL_INTO_VIEW · departamente: .circle
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=null
actionList: **growBigIn**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: SCALE[self] x=0,y=0 0ms
- g2: SCALE[self] x=1,y=1 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-357 · SCROLL_INTO_VIEW · departamente: .branding_image
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=200 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-361 · SCROLL_INTO_VIEW · departamente: .lottie-text.text-style-muted
config: loop=false playInReverse=false scrollOffsetValue=10 scrollOffsetUnit=% delay=0 direction=BOTTOM
actionList: **slideInBottom**
- g0: STYLE_OPACITY[self] v=0 0ms
- g1: MOVE[self] x=0PX,y=100PX 0ms
- g2: MOVE[self] x=0PX,y=0PX 1000ms outQuart ; STYLE_OPACITY[self] v=1 1000ms outQuart

## e-363 · SCROLLING_IN_VIEW · departamente: .hp-wrapper
config: continuousParameterGroupId=a-94-p smoothing=80
actionList: **[Home] Portfolio Parallax**
- continuous SCROLL_PROGRESS:
  - @0%: MOVE[CHILDREN .hp-image-left] y=0px 500ms ; MOVE[CHILDREN .hp-image-right] y=0px 500ms
  - @100%: MOVE[CHILDREN .hp-image-left] y=400px 500ms ; MOVE[CHILDREN .hp-image-right] y=-800px 500ms

