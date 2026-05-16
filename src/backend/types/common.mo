import Time "mo:core/Time";

module {
  public type Timestamp = Time.Time;
  public type EmployeeId = Nat; // numeric employee ID used for login

  public type Role = {
    #SystemAdmin;
    #Employee;
    #SafetyOfficer;
    #HOD;
    #AreaInCharge;
    #ContractorAdmin;
  };

  public type UserStatus = { #Active; #Inactive };

  public type Result<T> = { #ok : T; #err : Text };
};
