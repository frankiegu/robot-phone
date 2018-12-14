import demoRouter from './demo'
import emsRouter from './ems'
import smsRouter from './sms'
import omsRouter from './oms'
import pamsRouter from './pams'
import camsRouter from './cams'

export default {
  ems: emsRouter,
  sms: smsRouter,
  oms: omsRouter,
  pams: pamsRouter,
  cams: camsRouter
}