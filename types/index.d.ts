declare global {
  type Offer = {
    companyName: string
    applied: boolean
    answerReceived: boolean
    classified: boolean
    applyDate?: string
    offerDate?: string
    offerLink?: string
    experienceRequired?: number
    additionalNotes?: string
  }
}

export {}
