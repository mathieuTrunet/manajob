declare global {
  type Offer = {
    id: string
    companyName: string
    applied: boolean
    answerReceived: boolean
    archived: boolean
    applyDate?: string
    offerDate?: string
    offerLink?: string
    experienceRequired?: number
    additionalNotes?: string
  }
}

export {}
