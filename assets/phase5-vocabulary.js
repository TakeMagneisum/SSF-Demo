/* UI vocabulary only. Never modify provider records or emergency classifier input. */
(function (global) {
  'use strict';
  global.SSF_SEARCH_VOCABULARY = Object.freeze({
    food: ['grocery','groceres','grocceries','food bank','food stamps'],
    housing: ['utilities','utilites','utility assistance','electric bill','electricity bill','power bill','water bill','power shut off','electricity disconnected','power disconnected','utility shutoff','rental assistance','somewhere to sleep'],
    health: ['dentistry','dentle','dental care','medical bills','prescriptions'],
    transportation: ['ride to an appointment','ride to appointment','transport','bus fare','transportaion'],
    family: ['childcare','daycare','care giver'],
    work: ['unemployment','job training','resume help'],
    animals: ['pet food','vet bill','veterinary care'],
    legal: ['legal aid','legal advice','lawyer help']
  });
})(window);
