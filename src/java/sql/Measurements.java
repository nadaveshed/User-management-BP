
package sql;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.Timestamp;

/**
 *
 * @author nadav
 */
public class Measurements {

    private long dateMs;
    private int systolic;
    private int diastolic;

    public Measurements(ResultSet rs) {
        try {
            this.systolic = rs.getInt("systolic");
            this.diastolic = rs.getInt("diastolic");
            this.dateMs = rs.getTimestamp("date").getTime();
        } catch (Exception exp) {
            exp.printStackTrace();
        }
    }

    public long getDateMs() {
        return dateMs;
    }

    public void setDateMs(long dateMs) {
        this.dateMs = dateMs;
    }

    public int getSystolic() {
        return systolic;
    }

    public void setSystolic(int systolic) {
        this.systolic = systolic;
    }

    public int getDiastolic() {
        return diastolic;
    }

    public void setDiastolic(int diastolic) {
        this.diastolic = diastolic;
    }

}
