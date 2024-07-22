interface UserObject {
  nom: string;
  age: number;
  email: string;
  fuser: FUser; // Assuming FUser is the type for your fuser object
}

interface FUser {
  idFUser: string;
  libelleFamille: string;
  coefficient: number;
  remarques: string;
}
